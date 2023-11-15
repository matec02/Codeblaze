package com.projektr.codeblaze.dao;

import com.projektr.codeblaze.domain.PrivacySettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PrivacySettingsRepository extends JpaRepository<PrivacySettings, Long> {
        Optional<PrivacySettings> findByUserSocialMediaId(Long userId);
}
