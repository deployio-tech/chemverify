package com.fyp.server.controller;

import com.fyp.server.dto.LambdaCallbackDTO;
import com.fyp.server.dto.userChemRequestDTO;
import com.fyp.server.service.userChemService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/chemicalIngredients")
@Slf4j
public class userChemController {

    private final userChemService userChemService;

    public userChemController(userChemService userChemService) {
        this.userChemService = userChemService;
    }

    /**
     * Submit a new chemical ingredient analysis request.
     * 1. Uploads image to S3, saves doc with status = PROCESSING
     * 2. Polls MongoDB until Lambda updates status to COMPLETED (by s3Key)
     * 3. On COMPLETED, calls RAG service with skinType + extractedText
     * 4. On timeout, returns error to the user
     */
    @PostMapping("/")
    public ResponseEntity<?> userChemRequest(
            @RequestPart("file") MultipartFile file,
            @RequestPart("data") userChemRequestDTO userChemRequestDTO) {
        log.info("Received new analysis request");
        return userChemService.createUserChemRequest(file, userChemRequestDTO);
    }

    /**
     * Fetch analysis history for the currently authenticated user.
     * Returns all UserChem documents sorted by creation date (newest first).
     */
    @GetMapping("/history")
    public ResponseEntity<?> getAnalysisHistory() {
        log.info("Fetching analysis history for current user");
        return userChemService.getAnalysisHistory();
    }
}

