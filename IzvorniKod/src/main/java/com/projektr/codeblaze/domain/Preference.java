package com.projektr.codeblaze.domain;

import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
@Table(name = "preference")
public class Preference {

    @Id
    private Long userPreferenceId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "userPreferenceId")
    private User user;

    @Column(name = "darkMode", nullable = false)
    private boolean darkMode;

    @Enumerated(EnumType.STRING)
    @Column(name = "language", nullable = false, length = 50)
    private PreferenceUserLanguage language;
}
