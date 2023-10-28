package com.projektr.codeblaze.service;

import com.projektr.codeblaze.dao.IdentificationDocumentRepository;
import com.projektr.codeblaze.domain.IdentificationDocument;
import com.projektr.codeblaze.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class IdentificationDocumentService {
    @Autowired
    private IdentificationDocumentRepository identificationDocumentRepository;

    public IdentificationDocument getIdentificationDocumentByUser(User user){
        return identificationDocumentRepository.findByUser(user);
    }
}
