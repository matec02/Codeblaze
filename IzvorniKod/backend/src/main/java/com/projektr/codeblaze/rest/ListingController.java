package com.projektr.codeblaze.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projektr.codeblaze.dao.ListingRepository;
import com.projektr.codeblaze.domain.Listing;
import com.projektr.codeblaze.domain.Scooter;
import com.projektr.codeblaze.domain.User;
import com.projektr.codeblaze.domain.ListingStatus;
import com.projektr.codeblaze.service.DocumentService;
import com.projektr.codeblaze.service.ScooterService;
import com.projektr.codeblaze.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/listing")
public class ListingController {
    private final ScooterService scooterService;
    private final UserService userService;

    private final ListingRepository listingRepository;

    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);

    @Autowired
    public ListingController(ScooterService scooterService, UserService userService, ListingRepository listingRepository) {
        this.scooterService = scooterService;
        this.userService = userService;
        this.listingRepository = listingRepository;
    }


    @GetMapping("get-listings/{listingStatus}")
    public ResponseEntity<List<Listing>> getListingsByStatus(@PathVariable String listingStatus) {
        List<Listing> listings = scooterService.getAvailableScooters(true).stream()
                .filter(listing -> listing.getStatus() == ListingStatus.valueOf(listingStatus))
                .collect(Collectors.toList());
        return ResponseEntity.ok(listings);
    }

    @DeleteMapping("/delete-listing/{listingId}")
    public ResponseEntity<String> deleteListing(@PathVariable Long listingId) {
        try {
            scooterService.deleteListing(listingId);
            return ResponseEntity.ok("Listing deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Listing not found with ID: " + listingId);
        }
    }
    @GetMapping("/listing/{userId}")
    public ResponseEntity<List<Listing>> getListingsByUserId(@PathVariable Long userId) {
        List<Listing> listings = scooterService.getAvailableScooters(true).stream()
                .filter(listing -> listing.getScooter() != null)
                .filter(listing -> listing.getScooter().getUser() != null)
                .filter(listing -> userId.equals(listing.getScooter().getUser().getUserId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(listings);
    }
    @PutMapping("/edit-listing/{listingId}")
    public ResponseEntity<Listing> updateListingInfo(@PathVariable Long listingId, @RequestBody Listing listing) {
        try {
            Listing updatedListing = scooterService.updateListingInfo(listingId, listing);
            return ResponseEntity.ok(updatedListing);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }


    @PutMapping("/update-listing-status/{listingId}")
    public ResponseEntity<Listing> updateListingStatus(@PathVariable Long listingId, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        Listing listing = scooterService.updateListingStatus(listingId, newStatus);
        return ResponseEntity.ok(listing);
    }

    @PutMapping("/update-listing/{listingId}")
    public ResponseEntity<?> updateListing(@PathVariable Long listingId,
                                           @RequestPart("status") String statusJson,
                                           @RequestPart("clientUsername") String clientUsernameJson) {
        logger.info("Request to update listing received. Listing ID: {}", listingId);

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String status = objectMapper.readValue(statusJson, String.class);
            String clientUsername = objectMapper.readValue(clientUsernameJson, String.class);

            Listing listing = scooterService.updateListing(listingId, clientUsername, status);
            if (listing != null) {
                return ResponseEntity.ok(listing);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Listing not found for ID: " + listingId);
            }
        } catch (Exception e) {
            logger.error("An error occurred during scooter registration", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during scooter registration.");
        }
    }

}
