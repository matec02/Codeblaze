package com.projektr.codeblaze.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projektr.codeblaze.domain.Scooter;
import com.projektr.codeblaze.domain.User;
import com.projektr.codeblaze.service.DocumentService;
import com.projektr.codeblaze.service.ScooterService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scooters")
public class ScooterController {

    private final ScooterService scooterService;

    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);
    @Autowired
    public ScooterController(ScooterService scooterService) {
        this.scooterService = scooterService;
    }

    @CrossOrigin(origins = "https://codeblazefe.onrender.com")
    @GetMapping("owner/{ownerId}")
    public ResponseEntity<List<Scooter>> getScootersByOwnerId(@PathVariable Long ownerId) {
        List<Scooter> scooters = scooterService.getScootersByUserId(ownerId);
        if (scooters.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(scooters);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Scooter> getScooterById(@PathVariable Long id) {
        return scooterService.getScooterById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @CrossOrigin(origins = "https://codeblazefe.onrender.com")
    @GetMapping("/get-all-scooters")
    public ResponseEntity<List<Scooter>> getAllScooters() {
        List<Scooter> scooters = scooterService.getAllScooters();
        if (scooters.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(scooters);
    }

    @CrossOrigin(origins = "https://codeblazefe.onrender.com")
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

}
