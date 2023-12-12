package com.projektr.codeblaze.service;

import com.projektr.codeblaze.dao.ImageChangeRequestRepository;
import com.projektr.codeblaze.domain.ImageChangeRequest;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ImageChangeRequestService {
    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);

    private static ImageChangeRequestRepository imageChangeRequestRepository;

    public ImageChangeRequest save(ImageChangeRequest request) {
        return imageChangeRequestRepository.save(request);
    }
    @Transactional
    public ImageChangeRequest requestSubmit(ImageChangeRequest request){
        return null;
    }
}
