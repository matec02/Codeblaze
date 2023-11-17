package com.projektr.codeblaze.utils;

import com.projektr.codeblaze.domain.PrivacySettings;
import com.projektr.codeblaze.domain.User;
import lombok.Data;

@Data
public class PrivacySettingsSaveDTO {
    private User user;
    private PrivacySettings privacySettings;
}
