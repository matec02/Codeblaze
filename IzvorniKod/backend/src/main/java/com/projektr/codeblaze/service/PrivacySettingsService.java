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

    public void deletePrivacySettings(Long id) {
        privacySettingsRepository.deleteById(id);
    }

    public PrivacySettings initializePrivacySettings(PrivacySettings privacySettings) {
        return privacySettingsRepository.save(privacySettings);
    }

    @Transactional
    public PrivacySettings savePrivacySettings(PrivacySettingsSaveDTO privacySettingsSaveDTO) {

        User user = userRepository.findById(privacySettingsSaveDTO.getUser().getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));


        Optional<PrivacySettings> existingPrivacySettings = privacySettingsRepository
                .findByUserSocialMediaId(user.getUserId());

        PrivacySettings privacySettings;

        if (existingPrivacySettings.isPresent()) {

            privacySettings = existingPrivacySettings.get();
        } else {

            privacySettings = new PrivacySettings();
            privacySettings.setUser(user);
        }


        privacySettings.setFirstNameVisible(privacySettingsSaveDTO.getPrivacySettings().isFirstNameVisible());
        privacySettings.setLastNameVisible(privacySettingsSaveDTO.getPrivacySettings().isLastNameVisible());
        privacySettings.setEmailVisible(privacySettingsSaveDTO.getPrivacySettings().isEmailVisible());
        privacySettings.setPhoneNumberVisible(privacySettingsSaveDTO.getPrivacySettings().isPhoneNumberVisible());


        return privacySettingsRepository.save(privacySettings);
    }

}
