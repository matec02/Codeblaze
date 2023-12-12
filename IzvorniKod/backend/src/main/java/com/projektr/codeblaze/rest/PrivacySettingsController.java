package com.projektr.codeblaze.rest;

import com.projektr.codeblaze.domain.PrivacySettings;
import com.projektr.codeblaze.service.PrivacySettingsService;
import com.projektr.codeblaze.utils.PrivacySettingsSaveDTO;
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

    @CrossOrigin(origins = "https://codeblazefe.onrender.com")
    @GetMapping("/{userId}")
    public ResponseEntity<PrivacySettings> getPrivacySettingsByUserId(@PathVariable Long userId) {
        PrivacySettings privacySettings = privacySettingsService.getPrivacySettings(userId);

        if (privacySettings != null) {
            return ResponseEntity.ok(privacySettings);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @CrossOrigin(origins = "https://codeblazefe.onrender.com")
    @PostMapping("/save")
    public ResponseEntity<PrivacySettings> savePrivacySettings(@RequestBody PrivacySettingsSaveDTO privacySettingsSaveDTO) {
        PrivacySettings privacySettingsSaved = privacySettingsService.savePrivacySettings(privacySettingsSaveDTO);

        if (privacySettingsSaved != null) {
            return ResponseEntity.ok(privacySettingsSaved);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
