package com.fyp.server.service;

import com.fyp.server.dto.LambdaCallbackDTO;
import com.fyp.server.dto.userChemRequestDTO;
import com.fyp.server.entity.AnalysisStatus;
import com.fyp.server.entity.SkinType;
import com.fyp.server.entity.User;
import com.fyp.server.entity.UserChem;
import com.fyp.server.repository.UserChemRepository;
import com.fyp.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class userChemService {

    private final UserChemRepository userChemRepository;
    private final UserRepository userRepository;
    private final imageService imageService;
    private final ragService ragService;

    // Polling configuration
    private static final int POLL_INTERVAL_MS = 3000;   // Poll every 3 seconds
    private static final int MAX_POLL_TIME_MS = 90000;   // Max wait: 90 seconds

    /**
     * Create a new analysis request:
     * 1. Upload image to S3 (triggers Lambda via S3 event)
     * 2. Save UserChem document with status = PROCESSING
     * 3. Poll MongoDB until Lambda updates status to COMPLETED
     * 4. On COMPLETED, call RAG service with skinType + extractedText
     * 5. Return final result to client
     */
    public ResponseEntity<?> createUserChemRequest(MultipartFile file, userChemRequestDTO requestDTO) {
        try {
            // Get the current authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = (User) authentication.getPrincipal();
            String userId = currentUser.getUserId();

            // Upload image to S3 (this triggers the Lambda via S3 event notification)
            String imageUrl = imageService.uploadFile(file);

            // Extract S3 key from the imageUrl
            String s3Key = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);

            // Build and save UserChem document
            UserChem userChem = UserChem.builder()
                    .userId(userId)
                    .s3Key(s3Key)
                    .imageUrl(imageUrl)
                    .skinType(SkinType.fromString(requestDTO.getSkinType()))
                    .ingredients(requestDTO.getIngredients())
                    .status(AnalysisStatus.PROCESSING)
                    .build();

            UserChem saved = userChemRepository.save(userChem);

            // Add reference to User's userChem list
            currentUser.getUserChem().add(saved);
            userRepository.save(currentUser);

            log.info("Created analysis request with id: {}. Starting to poll for Lambda completion...", saved.getId());

            // ===== POLL MongoDB for Lambda completion =====
            UserChem updatedChem = pollForCompletion(saved.getId());

            if (updatedChem == null) {
                log.error("Polling timed out for id: {}", saved.getId());
                return ResponseEntity.ok(Map.of(
                        "message", "Analysis is still processing. Lambda has not completed yet.",
                        "id", saved.getId(),
                        "status", "PROCESSING"
                ));
            }

            if (updatedChem.getStatus() == AnalysisStatus.FAILED) {
                log.error("Lambda processing failed for id: {}", saved.getId());
                return ResponseEntity.ok(Map.of(
                        "message", "Lambda processing failed.",
                        "id", saved.getId(),
                        "status", "FAILED"
                ));
            }

            // ===== Lambda completed! Call RAG service =====
            log.info("Lambda completed for id: {}. Extracted text length: {}. Calling RAG service...",
                    updatedChem.getId(),
                    updatedChem.getExtractedText() != null ? updatedChem.getExtractedText().length() : 0);

            try {
                // Split extracted text into ingredient lines for the RAG service
                List<String> ingredientsList = Arrays.stream(updatedChem.getExtractedText().split("\\n"))
                        .map(String::trim)
                        .filter(line -> !line.isEmpty())
                        .collect(Collectors.toList());

                Map<String, Object> ragRequest = new HashMap<>();
                ragRequest.put("ingredients", ingredientsList);
                ragRequest.put("skinType", updatedChem.getSkinType().name());
                String ragResponse = ragService.sendDataToRender(ragRequest);
                updatedChem.setRagResponse(ragResponse);
                updatedChem.setStatus(AnalysisStatus.COMPLETED);
                userChemRepository.save(updatedChem);

                log.info("RAG response received and saved for id: {}", updatedChem.getId());

                Map<String, Object> response = new HashMap<>();
                response.put("message", "Analysis completed successfully.");
                response.put("id", updatedChem.getId());
                response.put("status", updatedChem.getStatus().name());
                response.put("ragResponse", ragResponse);
                return ResponseEntity.ok(response);

            } catch (Exception e) {
                log.error("Error calling RAG service for id {}: {}", updatedChem.getId(), e.getMessage());
                updatedChem.setStatus(AnalysisStatus.FAILED);
                userChemRepository.save(updatedChem);
                return ResponseEntity.internalServerError().body(
                        Map.of("message", "Lambda succeeded but RAG service failed: " + e.getMessage(),
                                "id", updatedChem.getId(),
                                "status", "FAILED")
                );
            }

        } catch (Exception e) {
            log.error("Error creating analysis request: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(
                    Map.of("message", "Failed to create analysis request: " + e.getMessage())
            );
        }
    }

    /**
     * Poll MongoDB every POLL_INTERVAL_MS until the UserChem status
     * changes from PROCESSING, or until MAX_POLL_TIME_MS is exceeded.
     *
     * @return Updated UserChem if status changed, or null on timeout.
     */
    private UserChem pollForCompletion(String documentId) {
        long startTime = System.currentTimeMillis();
        int pollCount = 0;

        while (System.currentTimeMillis() - startTime < MAX_POLL_TIME_MS) {
            try {
                Thread.sleep(POLL_INTERVAL_MS);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.error("Polling interrupted for id: {}", documentId);
                return null;
            }

            pollCount++;
            Optional<UserChem> optionalChem = userChemRepository.findById(documentId);

            if (optionalChem.isPresent()) {
                UserChem chem = optionalChem.get();
                log.info("Poll #{} for id {}: status = {}", pollCount, documentId, chem.getStatus());

                if (chem.getStatus() != AnalysisStatus.PROCESSING) {
                    // Lambda has updated the status (either COMPLETED or FAILED)
                    return chem;
                }
            } else {
                log.error("Document {} disappeared during polling!", documentId);
                return null;
            }
        }

        log.warn("Polling timed out after {}ms for id: {} ({} polls)",
                MAX_POLL_TIME_MS, documentId, pollCount);
        return null;
    }

    /**
     * Handle Lambda callback (kept for backward compatibility):
     * 1. Update status and extractedText in the UserChem document
     * 2. If COMPLETED, call RAG service with skinType + extractedText
     */
    public ResponseEntity<?> handleLambdaCallback(LambdaCallbackDTO callbackDTO) {
        try {
            Optional<UserChem> optionalUserChem = userChemRepository.findById(callbackDTO.getId());
            if (optionalUserChem.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "UserChem document not found."));
            }

            UserChem userChem = optionalUserChem.get();
            userChem.setStatus(AnalysisStatus.valueOf(callbackDTO.getStatus().toUpperCase()));
            userChem.setExtractedText(callbackDTO.getExtractedText());

            if (userChem.getStatus() == AnalysisStatus.COMPLETED && userChem.getExtractedText() != null) {
                // Call RAG service
                try {
                    Map<String, String> ragRequest = Map.of(
                            "skinType", userChem.getSkinType().name(),
                            "extractedText", userChem.getExtractedText()
                    );
                    String ragResponse = ragService.sendDataToRender(ragRequest);
                    userChem.setRagResponse(ragResponse);
                    log.info("RAG response received for id: {}", userChem.getId());
                } catch (Exception e) {
                    log.error("Error calling RAG service for id {}: {}", userChem.getId(), e.getMessage());
                    userChem.setStatus(AnalysisStatus.FAILED);
                }
            }

            userChemRepository.save(userChem);

            return ResponseEntity.ok(Map.of(
                    "message", "Callback processed successfully.",
                    "id", userChem.getId(),
                    "status", userChem.getStatus().name()
            ));
        } catch (Exception e) {
            log.error("Error processing Lambda callback: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(
                    Map.of("message", "Failed to process callback: " + e.getMessage())
            );
        }
    }

    /**
     * Get analysis history for the currently authenticated user.
     */
    public ResponseEntity<?> getAnalysisHistory() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = (User) authentication.getPrincipal();
            String userId = currentUser.getUserId();

            List<UserChem> history = userChemRepository.findByUserIdOrderByCreatedAtDesc(userId);

            return ResponseEntity.ok(history);
        } catch (Exception e) {
            log.error("Error fetching analysis history: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(
                    Map.of("message", "Failed to fetch analysis history: " + e.getMessage())
            );
        }
    }
}
