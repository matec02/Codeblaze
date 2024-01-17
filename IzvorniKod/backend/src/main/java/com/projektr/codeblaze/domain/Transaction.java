package com.projektr.codeblaze.domain;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "transaction")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transactionId", updatable = false, nullable = false)
    private Long transactionId;

    @Column(name = "kilometersTraveled", nullable = false)
    private double kilometersTraveled;

    @Column(name = "totalPrice", nullable = false)
    private double totalPrice;

    @Column(name = "paymentTime", nullable = false)
    private LocalDateTime paymentTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "transactionStatus", nullable = false, length = 50)
    private TransactionStatus status = TransactionStatus.UNSEEN;

    @ManyToOne
    @JoinColumn(name = "ownerId", referencedColumnName = "userId", nullable = false)
    private User owner;

    @ManyToOne
    @JoinColumn(name = "clientId", referencedColumnName = "userId", nullable = false)
    private User client;

    @ManyToOne
    @JoinColumn(name = "listingId", referencedColumnName = "listingId", nullable = false)
    private Listing listing;

    //obrisan invoice
    //kaze u zadatku transakcija se automatski obavi i spremi - ne placas direktno ti pa ni nema biranja nacina placanja
}
