package com.projektr.codeblaze.rest;

import com.projektr.codeblaze.domain.Scooter;
import com.projektr.codeblaze.domain.User;
import com.projektr.codeblaze.service.ScooterService;
import com.projektr.codeblaze.utils.ScooterRegistrationDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scooters")
public class ScooterController {
    private final ScooterService scooterService;

    @Autowired
    public ScooterController(ScooterService scooterService) {
        this.scooterService = scooterService;
    }


//    TODO nakon dodavanja scootera obrisati token i ponovno ga dodijeliti korisniku!!!!
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

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/register-scooter")
    public ResponseEntity<?> registerScooter(@RequestBody ScooterRegistrationDTO registrationDTO) {
        User user = registrationDTO.getUser();
        Scooter scooter = registrationDTO.getScooter();
        Scooter registeredScooter = scooterService.registerScooter(user, scooter);
        if (registeredScooter != null) {
            return ResponseEntity.ok(registeredScooter);
        }
        return ResponseEntity.badRequest().body("Scooter could not be registered");
    }


    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/get-all-scooters")
    public ResponseEntity<List<Scooter>> getAllScooters() {
        List<Scooter> scooters = scooterService.getAllScooters();
        if (scooters.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(scooters);
    }

    @PostMapping
    public ResponseEntity<Scooter> createScooter(@Valid @RequestBody Scooter scooter) {
        Scooter newScooter = scooterService.saveScooter(scooter);
        return new ResponseEntity<>(newScooter, HttpStatus.CREATED);
    }

}
