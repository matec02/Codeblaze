package com.projektr.codeblaze.domain;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User reviewer;

    @ManyToOne
    private Scooter reviewedScooter;

    private int rating;
    private String review;
    private Date timestampOfRating;

}
