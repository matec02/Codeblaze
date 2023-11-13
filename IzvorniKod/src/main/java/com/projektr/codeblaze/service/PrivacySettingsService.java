package com.projektr.codeblaze.service;

import com.projektr.codeblaze.dao.PrivacySettingsRepository;
import com.projektr.codeblaze.domain.PrivacySettings;
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
}
