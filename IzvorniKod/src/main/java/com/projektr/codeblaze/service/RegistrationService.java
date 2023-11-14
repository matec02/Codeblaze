package com.projektr.codeblaze.service;

import com.projektr.codeblaze.domain.Document;
import com.projektr.codeblaze.domain.DocumentStatus;
import com.projektr.codeblaze.domain.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class RegistrationService {

    @Autowired
    private UserService userService;

    @Autowired
    private DocumentService documentService;

    @Transactional
    public User registerUserAndUploadDocuments(User user, MultipartFile criminalRecordFile, MultipartFile identificationDocumentFile) throws IOException {
        User registeredUser = userService.register(user);

        // Assuming you have methods to save files and return the path
        String criminalRecordPath = "../../src/main/java/" + documentService.saveFile(criminalRecordFile, registeredUser, "CR").substring(2);
        String identificationDocumentPath = "../../src/main/java/" + documentService.saveFile(identificationDocumentFile, registeredUser, "ID").substring(2);

        Document document = new Document();
        document.setUser(registeredUser);
        document.setPathCriminalRecord(criminalRecordPath);
        document.setPathIdentification(identificationDocumentPath);
        document.setStatus(DocumentStatus.PENDING);

        documentService.saveDocumentPaths(document);

        return registeredUser;
    }
}
