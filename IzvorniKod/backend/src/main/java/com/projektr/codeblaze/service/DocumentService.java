package com.projektr.codeblaze.service;

import com.projektr.codeblaze.dao.DocumentRepository;
import com.projektr.codeblaze.domain.Document;
import com.projektr.codeblaze.domain.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
public class DocumentService {
    private final DocumentRepository documentRepository;
    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);

    private static String UPLOAD_FOLDER  = "./IzvorniKod/src/main/resources/static/images";

    @Autowired
    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    public List<Document> getDocuments() {
        return documentRepository.findAll();
    }

    public Document saveDocumentPaths(Document document) {
        return documentRepository.save(document);
    }


    public String saveFile(MultipartFile file, User user, String tag) throws IOException {
        logger.info("Saving file: {}", tag);
        logger.info(UPLOAD_FOLDER);
        Path uploadPath = Paths.get(UPLOAD_FOLDER);
        if (!Files.exists(uploadPath)) {
            logger.info("Upload directory not found, creating: {}", uploadPath.toAbsolutePath());
            Files.createDirectories(uploadPath);
        }
        logger.info("UPLOAD PATH: {}", uploadPath);
        String fileExtension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String newFilename = user.getNickname() + "-" + tag + (fileExtension != null ? "." + fileExtension : "");
        Path filePath = uploadPath.resolve(newFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        logger.info("Successfully saved picture");
        return newFilename;
    }
}
