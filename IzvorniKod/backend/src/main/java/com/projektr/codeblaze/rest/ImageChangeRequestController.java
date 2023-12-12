package com.projektr.codeblaze.rest;

import com.projektr.codeblaze.service.ImageChangeRequestService;
import com.projektr.codeblaze.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/imageChangeRequest")
public class ImageChangeRequestController {

    private final ImageChangeRequestService imageChangeRequestService;
    @Autowired
    public ImageChangeRequestController(ImageChangeRequestService imageChangeRequestService){
        this.imageChangeRequestService = imageChangeRequestService;}


}
