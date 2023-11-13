package com.projektr.codeblaze.service;

import com.projektr.codeblaze.dao.PrivacySettingsRepository;
import com.projektr.codeblaze.domain.PrivacySettings;
import com.projektr.codeblaze.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PrivacySettingsService {
    private final PrivacySettingsRepository privacySettingsRepository;

    @Autowired
    public PrivacySettingsService(PrivacySettingsRepository privacySettingsRepository) {
        this.privacySettingsRepository = privacySettingsRepository;
    }

    public PrivacySettings getPrivacySettings(Long userId) {
        return privacySettingsRepository.findById(userId).orElse(null);
    }

    public PrivacySettings initializePrivacySettings(User user) {
        PrivacySettings privacySettings = new PrivacySettings();

        privacySettings.setUserSocialMediaId(user.getUserId());
        privacySettings.setEmailNameVisible(false);
        privacySettings.setPhoneNumberVisible(false);
        privacySettings.setFirstNameVisible(false);
        privacySettings.setSecondNameVisible(false);
        privacySettings.setEmailNameVisible(false);

        return privacySettingsRepository.save(privacySettings);
    }
}
