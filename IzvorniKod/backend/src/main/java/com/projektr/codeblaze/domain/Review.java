package com.projektr.codeblaze.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "review")
public class Review {

    @Id
    private Long transactionReviewId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "transactionReviewId")
    private Transaction transaction;

    @Column(name = "stars")
    @Min(1)
    @Max(5)
    private int stars; //limit them 1 to 5

    @Column(name = "comment")
    private String comment;

    @Column(name = "reviewTime")
    private LocalDateTime reviewTime;
    public Timestamp getReviewTime() {
        if (reviewTime != null) {
            return Timestamp.valueOf(reviewTime);
        }
        return null; // Handle the case when paymentTime is null, if needed
    }

    @ManyToOne
    @JoinColumn(name = "reviewerUsername", referencedColumnName = "nickname", nullable = false)
    private User reviewerUsername; //provjeriti

    @ManyToOne
    @JoinColumn(name = "renterUsername", referencedColumnName = "nickname", nullable = false)
    private User renterUsername;

}
