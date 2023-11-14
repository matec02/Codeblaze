package com.projektr.codeblaze.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projektr.codeblaze.domain.User;
import com.projektr.codeblaze.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/registration")
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping(value = "/complete", consumes = "multipart/form-data")
    public ResponseEntity<?> completeRegistration(
            @RequestPart("user") String userJson,
            @RequestPart("criminalRecord") MultipartFile criminalRecordFile,
            @RequestPart("identificationDocument") MultipartFile identificationDocumentFile) {

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            User user = objectMapper.readValue(userJson, User.class);

            User registeredUser = registrationService.registerUserAndUploadDocuments(user, criminalRecordFile, identificationDocumentFile);

            if (registeredUser != null) {
                return ResponseEntity.ok(registeredUser); // Or some success DTO
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed.");
            }
        } catch (Exception e) {
            // Exception handling logic here...
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during registration.");
        }
    }
}

