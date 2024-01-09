package com.projektr.codeblaze.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.util.ISO8601DateFormat;
import com.projektr.codeblaze.domain.ImageChangeRequest;
import com.projektr.codeblaze.domain.Scooter;
import com.projektr.codeblaze.domain.User;
import com.projektr.codeblaze.service.DocumentService;
import com.projektr.codeblaze.service.ImageChangeRequestService;
import com.projektr.codeblaze.service.RegistrationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/imageChangeRequest")
public class ImageChangeRequestController {

    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);
    private final ImageChangeRequestService imageChangeRequestService;
    @Autowired
    public ImageChangeRequestController(ImageChangeRequestService imageChangeRequestService){
        this.imageChangeRequestService = imageChangeRequestService;}

    @PostMapping(value = "/send", consumes = "multipart/form-data")
    public ResponseEntity<?> sendScooter(
            @RequestPart("complaintTime") String complaintTimeJson,
            @RequestPart("additionalComments") String commentsJson,
            @RequestPart("photoUrlNewImage") String newPhotoUrlJson,
            @RequestPart("photoUrlOldImage") String oldPhotoUrlJson,
            @RequestPart("user") String userJson) {

        try {
            ObjectMapper objectMapper = new ObjectMapper();

            User user = objectMapper.readValue(userJson, User.class);
            String cleanIsoDate = complaintTimeJson.replace("'", ""); // Remove single quotes
            OffsetDateTime odt = OffsetDateTime.parse(cleanIsoDate);
            LocalDateTime ldt = odt.toLocalDateTime();
            ldt = ldt.plusHours(1);
            String comments = objectMapper.readValue(commentsJson, String.class);
            String newPhotoUrl = objectMapper.readValue(newPhotoUrlJson, String.class);
            String oldPhotoUrl = objectMapper.readValue(oldPhotoUrlJson, String.class);

            ImageChangeRequest imageChangeRequest = imageChangeRequestService.requestSubmit(user, ldt,
                    newPhotoUrl, oldPhotoUrl, comments);

            if (imageChangeRequest != null) {
                return ResponseEntity.ok(imageChangeRequest);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("New image request failed.");
            }
        } catch (Exception e) {
            logger.error("An error occurred during new image request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during new image request.");
        }
    }

    @GetMapping("/rejectedRequests")
    public ResponseEntity<List<ImageChangeRequest>> getAllRejectedRequests() {
        List<ImageChangeRequest> allRequests = imageChangeRequestService.findAll();
        List<ImageChangeRequest> rejectedRequests = imageChangeRequestService.getAllRejectedRequests(allRequests);
        if (rejectedRequests.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(rejectedRequests);
    }

    @GetMapping("/approvedRequests")
    public ResponseEntity<List<ImageChangeRequest>> getAllApprovedRequests() {
        List<ImageChangeRequest> allRequests = imageChangeRequestService.findAll();
        List<ImageChangeRequest> approvedRequests = imageChangeRequestService.getAllApprovedRequests(allRequests);
        if (approvedRequests.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(approvedRequests);
    }

    @GetMapping("/pendingRequests")
    public ResponseEntity<List<ImageChangeRequest>> getAllPendingRequests() {
        List<ImageChangeRequest> allRequests = imageChangeRequestService.findAll();
        List<ImageChangeRequest> pendingRequests = imageChangeRequestService.getAllPendingRequests(allRequests);
        if (pendingRequests.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(pendingRequests);
    }

    @GetMapping("{listingId}/numberOfComplaints")
    public ResponseEntity<?> getNumberOfComplaintByScooterId(@PathVariable Long listingId){
        // TODO
        // kada se listing napravi
        return null;
    }

    @PutMapping(value = "/adminDecision", consumes = "multipart/form-data")
    public ResponseEntity<?> updateRequestStatus(
            @RequestPart("decisionTime") String decisionTimeJson,
            @RequestPart("reason") String reasonJson,
            @RequestPart("newStatus") String newStatusJson,
            @RequestPart("requestId") String requestIdJson) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String reason = objectMapper.readValue(reasonJson, String.class);
            String newStatus = objectMapper.readValue(newStatusJson, String.class);
            String requestIdString = objectMapper.readValue(requestIdJson, String.class);
            Long requestId = Long.parseLong(requestIdString);
            String cleanIsoDate = decisionTimeJson.replace("'", ""); // Remove single quotes
            OffsetDateTime odt = OffsetDateTime.parse(cleanIsoDate);
            LocalDateTime ldt = odt.toLocalDateTime();
            ldt = ldt.plusHours(1);
            ImageChangeRequest imageChangeRequest =
                    imageChangeRequestService.updateOnAdminDecision(requestId, newStatus, reason, ldt);


            return ResponseEntity.ok(imageChangeRequest);
        } catch(Exception e) {
            logger.error("An error occurred during admin decision", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during admin decision");
        }
    }
}
