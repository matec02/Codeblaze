package com.projektr.codeblaze.domain;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private String nickname;
    private String email;
    private String cardNumber;
    private boolean isRegistered;

    @OneToOne
    private IdentificationDocument identificationDocument;
    @OneToOne
    private CriminalRecordDocument criminalRecordDocument;

    @OneToMany(mappedBy = "user")
    private List<Transaction> transactions;
}
