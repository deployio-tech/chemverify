package com.fyp.server.service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@Slf4j
public class imageService {
    private final S3Client s3Client;

    @Value("${aws.bucketName}")
    private String bucketName;

    public imageService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String uploadFile(MultipartFile file) throws IOException {
        log.info("inside the upload file");
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(
                putObjectRequest,
                software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes())
        );

        return "https://" + bucketName + ".s3.amazonaws.com/" + fileName;
    }
}