package com.projektr.codeblaze.rest;

import com.projektr.codeblaze.domain.Document;
import com.projektr.codeblaze.service.DocumentService;
import com.projektr.codeblaze.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/documents")
public class DocumentController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final DocumentService documentService;
    private final UserService userService;

    private static String UPLOAD_FOLDER  = "./IzvorniKod/src/main/resources/static/images";


    @Autowired
    public DocumentController(DocumentService documentService, UserService userService) {
        this.documentService = documentService;
        this.userService = userService;
    }

    @CrossOrigin(origins = "https://codeblazefe.onrender.com")
    @GetMapping("/all")
    public ResponseEntity<List<Document>> getDocumentsByUserId() {
        List<Document> documents = documentService.getDocuments();

        if (documents != null) {
            return ResponseEntity.ok(documents);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
