package com.projektr.codeblaze.domain;

import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table(name = "scooter")
public class Scooter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "scooterId", updatable = false, nullable = false)
    private Long scooterId;

    @Column(name = "manufacturer")
    private String manufacturer;

    @Column(name = "model")
    private String model;

    @Column(name = "batteryCapacity")
    private int batteryCapacity;

    @Column(name = "maxSpeed")
    private int maxSpeed;

    @Column(name= "imageURL", length = 500)
    private String imageURL;

    @Column(name = "maxRange")
    private double maxRange;

    @Column(name = "yearOfManufacture")
    private int yearOfManufacture;

    @Column(name = "additionalInformation")
    private String additionalInformation;

    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId", nullable = false)
    private User user;

    @Column(nullable = false)
    private Boolean availability;
}