package com.projektr.codeblaze.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projektr.codeblaze.domain.User;
import com.projektr.codeblaze.service.RegistrationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/registration")
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @PostMapping(value = "/complete", consumes = "multipart/form-data")
    public ResponseEntity<?> completeRegistration(
            @RequestPart("user") String userJson,
            @RequestPart("photoUrlCR") String criminalRecordFileJSON,
            @RequestPart("photoUrlID") String identificationDocumentFileJSON) {

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            User user = objectMapper.readValue(userJson, User.class);
            String criminalRecordFile = objectMapper.readValue(criminalRecordFileJSON, String.class);
            String identificationDocumentFile = objectMapper.readValue(identificationDocumentFileJSON, String.class);

            User registeredUser = registrationService.registerUserAndUploadDocuments(user, criminalRecordFile, identificationDocumentFile);

            if (registeredUser != null) {
                return ResponseEntity.ok(registeredUser);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during registration.");
        }
    }
}

