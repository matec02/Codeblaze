package com.projektr.codeblaze.domain;

import jakarta.jws.soap.SOAPBinding;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "socialMedia")
public class SocialMedia {

    @Id
    private Long userSocialMediaId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "userSocialMediaId")
    private User user;

    @Column(name = "instagram", length = 500)
    private String instagram;

    @Column(name = "facebook", length = 500)
    private String facebook;

    @Column(name = "google", length = 500)
    private String google;

    @Column(name = "tikTok", length = 500)
    private String tikTok;
}
