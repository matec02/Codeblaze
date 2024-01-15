package com.projektr.codeblaze.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Data
@Entity
@Table(name = "review")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @OneToOne
    @JoinColumn(name = "transactionId", nullable = false)
    private Transaction transaction;

    @Column(name = "stars")
    @Min(1)
    @Max(5)
    private int stars;

    @Column(name = "comment")
    private String comment;

    @Column(name = "reviewTime")
    private OffsetDateTime reviewTime;

    @ManyToOne
    @JoinColumn(name = "reviewerUsername", referencedColumnName = "nickname", nullable = false)
    private User reviewerUsername;

    @ManyToOne
    @JoinColumn(name = "renterUsername", referencedColumnName = "nickname", nullable = false)
    private User renterUsername;

}
