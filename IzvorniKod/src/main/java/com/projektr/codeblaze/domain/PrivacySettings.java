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

    @Column(name = "firstNameVisible", nullable = false)
    private boolean firstNameVisible;

    @Column(name = "lastNameVisible", nullable = false)
    private boolean lastNameVisible;

    @Column(name = "emailNameVisible", nullable = false)
    private boolean emailVisible;

    @Column(name = "phoneNumberVisible", nullable = false)
    private boolean phoneNumberVisible;
}
