package com.projektr.codeblaze.rest;

import com.projektr.codeblaze.domain.IdentificationDocument;
import com.projektr.codeblaze.domain.User;
import com.projektr.codeblaze.service.IdentificationDocumentService;
import com.projektr.codeblaze.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/identificationDocuments")
public class IdentificationDocumentController {
    @Autowired
    private IdentificationDocumentService identificationDocumentService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<IdentificationDocument> getIdentificationDocument(@PathVariable Long userId) {
        User user = UserService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        IdentificationDocument document = identificationDocumentService.getIdentificationDocumentByUser(user);
        if (document == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(document);
    }
}
