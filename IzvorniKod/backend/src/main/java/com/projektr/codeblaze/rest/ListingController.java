package com.projektr.codeblaze.rest;

import com.projektr.codeblaze.domain.Listing;
import com.projektr.codeblaze.domain.Scooter;
import com.projektr.codeblaze.service.ScooterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/scooters")
public class ListingController {
    private final ScooterService scooterService;

    @Autowired
    public ListingController(ScooterService scooterService) {
        this.scooterService = scooterService;
    }
    @GetMapping("/get-all-scooters")
    public List<Listing> getAllListings() {

        return scooterService.getAvailableScooters(true);
    }
}
