package com.projektr.codeblaze.service;

import com.projektr.codeblaze.domain.Document;
import com.projektr.codeblaze.domain.DocumentStatus;
import com.projektr.codeblaze.domain.User;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class RegistrationService {
    private static final Logger logger = LoggerFactory.getLogger(RegistrationService.class);

    @Autowired
    private UserService userService;

    @Autowired
    private DocumentService documentService;

    @Transactional
    public User registerUserAndUploadDocuments(User user, String criminalRecordFile, String identificationDocumentFile) throws IOException {
        User registeredUser = userService.register(user);

        logger.info("Preparing to save documents!");
        logger.info("Successfully saved the documents!");

        Document document = new Document();
        document.setUser(registeredUser);
        document.setPathCriminalRecord(criminalRecordFile);
        document.setPathIdentification(identificationDocumentFile);
        document.setStatus(DocumentStatus.PENDING);

        documentService.saveDocumentPaths(document);

        return registeredUser;
    }
}
