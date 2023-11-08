package com.projektr.codeblaze.rest;

import com.projektr.codeblaze.domain.Scooter;
import com.projektr.codeblaze.service.ScooterService;
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

    @GetMapping
    public List<Scooter> getAllScooters() {
        return scooterService.getAllScooters();
    }

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

    @PostMapping
    public ResponseEntity<Scooter> createScooter(@Valid @RequestBody Scooter scooter) {
        Scooter newScooter = scooterService.saveScooter(scooter);
        return new ResponseEntity<>(newScooter, HttpStatus.CREATED);
    }

}
