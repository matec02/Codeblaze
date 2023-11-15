package com.projektr.codeblaze.service;

import com.projektr.codeblaze.dao.PrivacySettingsRepository;
import com.projektr.codeblaze.dao.UserRepository;
import com.projektr.codeblaze.domain.PrivacySettings;
import com.projektr.codeblaze.domain.User;
import com.projektr.codeblaze.utils.PrivacySettingsSaveDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PrivacySettingsService {
    private final PrivacySettingsRepository privacySettingsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    public PrivacySettingsService(PrivacySettingsRepository privacySettingsRepository) {
        this.privacySettingsRepository = privacySettingsRepository;
    }

    public PrivacySettings getPrivacySettings(Long userId) {
        return privacySettingsRepository.findByUserSocialMediaId(userId).orElse(null);
    }

    public PrivacySettings initializePrivacySettings(PrivacySettings privacySettings) {
        return privacySettingsRepository.save(privacySettings);
    }

    @Transactional
    public PrivacySettings savePrivacySettings(PrivacySettingsSaveDTO privacySettingsSaveDTO) {
        // Fetch the user from the database.
        User user = userRepository.findById(privacySettingsSaveDTO.getUser().getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Try to find existing PrivacySettings for this user.
        Optional<PrivacySettings> existingPrivacySettings = privacySettingsRepository
                .findByUserSocialMediaId(user.getUserId());

        PrivacySettings privacySettings;

        if (existingPrivacySettings.isPresent()) {
            // If found, update the existing privacy settings.
            privacySettings = existingPrivacySettings.get();
        } else {
            // If not found, create a new PrivacySettings instance.
            privacySettings = new PrivacySettings();
            privacySettings.setUser(user);
        }

        // Update fields from DTO.
        privacySettings.setFirstNameVisible(privacySettingsSaveDTO.getPrivacySettings().isFirstNameVisible());
        privacySettings.setLastNameVisible(privacySettingsSaveDTO.getPrivacySettings().isLastNameVisible());
        privacySettings.setEmailVisible(privacySettingsSaveDTO.getPrivacySettings().isEmailVisible());
        privacySettings.setPhoneNumberVisible(privacySettingsSaveDTO.getPrivacySettings().isPhoneNumberVisible());

        // Save and return the updated/created PrivacySettings.
        return privacySettingsRepository.save(privacySettings);
    }

}
