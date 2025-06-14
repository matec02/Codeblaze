package com.projektr.codeblaze.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projektr.codeblaze.dao.ListingRepository;
import com.projektr.codeblaze.dao.ScooterRepository;
import com.projektr.codeblaze.domain.Listing;
import com.projektr.codeblaze.domain.Scooter;
import com.projektr.codeblaze.domain.User;
import com.projektr.codeblaze.service.DocumentService;
import com.projektr.codeblaze.service.ScooterService;
import com.projektr.codeblaze.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/scooters")
public class ScooterController {

    private final ScooterService scooterService;
    ScooterRepository scooterRepository;
    ListingRepository listingRepository;

    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);
    @Autowired
    public ScooterController(ScooterService scooterService, ScooterRepository scooterRepository, ListingRepository listingRepository) {
        this.scooterRepository = scooterRepository;
        this.listingRepository = listingRepository;
        this.scooterService = scooterService;
    }

    @GetMapping("owner/{ownerId}")
    public ResponseEntity<List<Scooter>> getScootersByOwnerId(@PathVariable Long ownerId) {
        List<Scooter> scooters = scooterService.getScootersByUserId(ownerId);
        return ResponseEntity.ok(scooters);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Scooter> getScooterById(@PathVariable Long id) {
        return scooterService.getScooterById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{scooterId}/updateImagePath")
    public ResponseEntity<?> updateImagePath(@PathVariable Long scooterId, @RequestBody Map<String, String> updates){
        String newImagePath = updates.get("imagePath");
        Scooter scooter = scooterService.updateImagePath(scooterId, newImagePath);
        return ResponseEntity.ok(scooter);
    }

    @PutMapping("/{scooterId}/updateIsDeleted")
    public ResponseEntity<?> updateIsDeleted(@PathVariable Long scooterId, @RequestBody Map<String, Boolean> updates){
        Boolean isDeleted = updates.get("isDeleted");
        Scooter scooter = scooterService.updateIsDeleted(scooterId, isDeleted);
        if (scooter == null){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Scooter is currently rented and cannot be deleted.");
        }
        return ResponseEntity.ok(scooter);
    }

    @GetMapping("/get-all-scooters")
    public ResponseEntity<List<Scooter>> getAllScooters() {
        List<Scooter> scooters = scooterService.getAllScooters();
        return ResponseEntity.ok(scooters);
    }

    @PostMapping(value = "/register", consumes = "multipart/form-data")
    public ResponseEntity<?> registerScooter(
            @RequestPart("scooter") String scooterJson,
            @RequestPart("photoUrl") String photoUrlJson,
            @RequestPart("user") String userJson) {

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            User user = objectMapper.readValue(userJson, User.class);
            Scooter scooter = objectMapper.readValue(scooterJson, Scooter.class);
            String photoUrl = objectMapper.readValue(photoUrlJson, String.class);

            Scooter registeredScooter = scooterService.registerScooterAndUploadPhoto(scooter, user, photoUrl);

            if (registeredScooter != null) {
                return ResponseEntity.ok(registeredScooter);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Scooter registration failed.");
            }
        } catch (Exception e) {
            logger.error("An error occurred during scooter registration", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during scooter registration.");
        }
    }

    @PostMapping
    public ResponseEntity<Scooter> createScooter(@Valid @RequestBody Scooter scooter) {
        Scooter newScooter = scooterService.saveScooter(scooter);
        return new ResponseEntity<>(newScooter, HttpStatus.CREATED);
    }
    @PostMapping("/update-availability/{scooterId}")
    public ResponseEntity<String> updateScooterAvailability(
            @PathVariable Long scooterId,
            @RequestBody Map<String, Object> data
    ) {
        try {

            Scooter scooter = scooterRepository.findById(scooterId)
                    .orElseThrow(() -> new IllegalArgumentException("Scooter not found with ID: " + scooterId));
            if (!scooter.getAvailability()) {

                scooterService.updateScooterAvailability(scooterId, true);
            }
            Listing newListing = new Listing();
            String returnByTimeString = (String) data.get("returnByTime");
            LocalDateTime returnByTime = LocalDateTime.parse(returnByTimeString);
            newListing.setReturnByTime(returnByTime);
            String currentAddress = (String) data.get("currentAddress");
            newListing.setCurrentAddress(currentAddress);
            String returnAddress = (String) data.get("returnAddress");
            newListing.setReturnAddress(returnAddress);
            newListing.setScooter(scooter);
            newListing.setListingTime(LocalDateTime.now());
            String penaltyFee = (String) data.get("penaltyFee");
            double penaltyFeeDouble = Double.parseDouble(penaltyFee);
            newListing.setPenaltyFee(penaltyFeeDouble);
            String pricePerKilometer = (String) data.get("pricePerKilometer");
            double pricePerKilometerDouble = Double.parseDouble(pricePerKilometer);
            newListing.setPricePerKilometer(pricePerKilometerDouble);
            listingRepository.save(newListing);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("\"Scooter availability updated and listing saved successfully\"");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("Error updating scooter availability and saving listing: " + e.getMessage());
        }
    }
    @PutMapping("/edited-scooter/{scooterId}")
    public ResponseEntity<Scooter> updateScooter(@PathVariable Long scooterId, @RequestBody Scooter scooter) {
        try {
            Scooter existingScooter = scooterRepository.findById(scooterId)
                    .orElseThrow(() -> new EntityNotFoundException("Scooter not found with id: " + scooterId));
            
            if (scooter.getManufacturer() != null) {
                existingScooter.setManufacturer(scooter.getManufacturer());
            }
            if (scooter.getModel() != null) {
                existingScooter.setModel(scooter.getModel());
            }
            existingScooter.setBatteryCapacity(scooter.getBatteryCapacity());
            existingScooter.setMaxSpeed(scooter.getMaxSpeed());
            existingScooter.setMaxRange(scooter.getMaxRange());
            existingScooter.setYearOfManufacture(scooter.getYearOfManufacture());

            if (scooter.getAdditionalInformation() != null) {
                existingScooter.setAdditionalInformation(scooter.getAdditionalInformation());
            }

            scooterService.saveScooter(existingScooter);
            
            return ResponseEntity.ok(scooter);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }


}


