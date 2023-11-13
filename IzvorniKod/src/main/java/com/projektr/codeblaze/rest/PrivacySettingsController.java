package com.projektr.codeblaze.rest;

import com.projektr.codeblaze.domain.PrivacySettings;
import com.projektr.codeblaze.service.PrivacySettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/privacy-settings")
public class PrivacySettingsController {

    private final PrivacySettingsService privacySettingsService;

    @Autowired
    public PrivacySettingsController(PrivacySettingsService privacySettingsService) {
        this.privacySettingsService = privacySettingsService;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/{id}")
    public ResponseEntity<PrivacySettings> getPrivacySettingsByUserId(@PathVariable Long id) {
        PrivacySettings privacySettings = privacySettingsService.getPrivacySettings(id);

        if (privacySettings != null) {
            return ResponseEntity.ok(privacySettings);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
