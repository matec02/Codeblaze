package com.projektr.codeblaze.rest;

import com.projektr.codeblaze.domain.Listing;
import com.projektr.codeblaze.domain.User;
import com.projektr.codeblaze.domain.ListingStatus;
import com.projektr.codeblaze.service.ScooterService;
import com.projektr.codeblaze.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/scooters")
public class ListingController {
    private final ScooterService scooterService;
    private final UserService userService;

    @Autowired
    public ListingController(ScooterService scooterService, UserService userService) {
        this.scooterService = scooterService;
        this.userService = userService;
    }
    @GetMapping("/get-available-scooters")
    public List<Listing> getAllListings() {

        return scooterService.getAvailableScooters(true);
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

    @PutMapping("/update-listing-status/{listingId}")
    public ResponseEntity<Listing> updateListingStatus(@PathVariable Long listingId, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        String newClientId = body.get("clientId");
        Listing listing = scooterService.updateListingStatus(listingId, newStatus);
        return ResponseEntity.ok(listing);
    }

    @PutMapping("/update-listing/{listingId}")
    public ResponseEntity<Listing> updateListing(@PathVariable Long listingId, Map<String, String> body) {

        String clientUsername = body.get("clientUsername");
        String status = body.get("status");

        Listing listing = scooterService.updateListing(listingId, clientUsername, status);
        return  ResponseEntity.ok(listing);
    }

}
