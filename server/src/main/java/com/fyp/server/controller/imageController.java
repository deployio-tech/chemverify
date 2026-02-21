package com.fyp.server.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.fyp.server.service.imageService;
@RestController
@RequestMapping("/api/files")
public class imageController {
    private final imageService s3Service;

    public imageController(imageService s3Service) {
        this.s3Service = s3Service;
    }

    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file) throws Exception {
        return s3Service.uploadFile(file);
    }
}
