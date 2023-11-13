package com.projektr.codeblaze.service;

import com.projektr.codeblaze.dao.PrivacySettingsRepository;
import com.projektr.codeblaze.domain.PrivacySettings;
import com.projektr.codeblaze.domain.User;
import com.projektr.codeblaze.utils.PrivacySettingsSaveDTO;
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

    public PrivacySettings initializePrivacySettings(PrivacySettings privacySettings) {
        return privacySettingsRepository.save(privacySettings);
    }

    public PrivacySettings savePrivacySettings(PrivacySettingsSaveDTO privacySettingsSaveDTO) {
        PrivacySettings privacySettings = new PrivacySettings();
        privacySettings.setUser(privacySettingsSaveDTO.getUser());
        privacySettings.setFirstNameVisible(privacySettingsSaveDTO.getPrivacySettings().isFirstNameVisible());
        privacySettings.setSecondNameVisible(privacySettingsSaveDTO.getPrivacySettings().isSecondNameVisible());
        privacySettings.setEmailNameVisible(privacySettingsSaveDTO.getPrivacySettings().isEmailNameVisible());
        privacySettings.setPhoneNumberVisible(privacySettingsSaveDTO.getPrivacySettings().isPhoneNumberVisible());
        return privacySettingsRepository.save(privacySettings);
    }
}
