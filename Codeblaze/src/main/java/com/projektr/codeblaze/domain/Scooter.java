package com.projektr.codeblaze.domain;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class Scooter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String model;
    private String brand;
    private double batteryLevel;
    private double pricePerKilometer;
    private double lateReturnPenalty = 0;

    @ManyToOne
    private User owner;

    @OneToMany(mappedBy = "scooter")
    private List<Transaction> pastTransactionsOfScooter;
}
