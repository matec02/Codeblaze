package com.projektr.codeblaze.domain;

import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table(name = "invoice")
public class Invoice {

    @Id
    private Long transactionId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "transactionId")
    private Transaction transaction;

    @Column(name = "invoiceNumber", nullable = false, unique = true) //probably unique?
    private Long invoiceNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "paymentMethod", nullable = false, length = 50)
    private InvoicePaymentMethod paymentMethod;

}
