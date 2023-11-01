package com.projektr.codeblaze.domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class CriminalRecordDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String url;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
