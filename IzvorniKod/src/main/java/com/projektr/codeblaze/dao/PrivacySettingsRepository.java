package com.projektr.codeblaze.dao;

import com.projektr.codeblaze.domain.PrivacySettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrivacySettingsRepository extends JpaRepository<PrivacySettings, Long> {
}
