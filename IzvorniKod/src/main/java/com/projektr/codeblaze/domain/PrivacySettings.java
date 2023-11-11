package com.projektr.codeblaze.domain;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "privacySettings")
public class PrivacySettings {

    @Id
    private Long userSocialMediaId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "userSocialMediaId")
    private User user;

    @Column(name = "isFirstNameVisible", nullable = false)
    private boolean isFirstNameVisible;

    @Column(name = "isSecondNameVisible", nullable = false)
    private boolean isSecondNameVisible;

    @Column(name = "isEmailNameVisible", nullable = false)
    private boolean isEmailNameVisible;

    @Column(name = "isPhoneNumberVisible", nullable = false)
    private boolean isPhoneNumberVisible;
}
