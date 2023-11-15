package com.projektr.codeblaze.service;

import com.projektr.codeblaze.domain.Document;
import com.projektr.codeblaze.domain.DocumentStatus;
import com.projektr.codeblaze.domain.User;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class RegistrationService {
    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);


    @Autowired
    private UserService userService;

    @Autowired
    private DocumentService documentService;

    @Transactional
    public User registerUserAndUploadDocuments(User user, MultipartFile criminalRecordFile, MultipartFile identificationDocumentFile) throws IOException {
        User registeredUser = userService.register(user);

        logger.info("Preparing to save documents!");

        String criminalRecordPath = documentService.saveFile(criminalRecordFile, registeredUser, "CR").substring(2);
        String identificationDocumentPath = documentService.saveFile(identificationDocumentFile, registeredUser, "ID").substring(2);

        logger.info("Successfully saved the documents!");

        Document document = new Document();
        document.setUser(registeredUser);
        document.setPathCriminalRecord(criminalRecordPath);
        document.setPathIdentification(identificationDocumentPath);
        document.setStatus(DocumentStatus.PENDING);

        documentService.saveDocumentPaths(document);

        return registeredUser;
    }
}
