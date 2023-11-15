package com.projektr.codeblaze.rest;

import com.projektr.codeblaze.service.DocumentService;
import com.projektr.codeblaze.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/api/documents")
public class DocumentController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final DocumentService documentService;
    private final UserService userService;

    private static String UPLOAD_FOLDER  = "./IzvorniKod/src/main/resources/static/images/";


    @Autowired
    public DocumentController(DocumentService documentService, UserService userService) {
        this.documentService = documentService;
        this.userService = userService;
    }


}
