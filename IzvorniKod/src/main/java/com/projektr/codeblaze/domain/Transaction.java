package com.projektr.codeblaze.domain;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user; // Reference to the client (user) involved in the transaction

    @ManyToOne
    private User lessor; // Reference to the lessor (user) involved in the transaction


    @ManyToOne
    private Scooter scooter; // Reference to the rented electric scooter

    private Date startTime; // Start time of the rental
    private Date endTime; // End time of the rental
    private double distance; // Distance traveled during the rental
    private double rentalPrice; // Price based on distance and rental terms
    private double lateReturnPenalty; // Penalty for late return
}
