package com.projektr.codeblaze.unitTests;


import com.projektr.codeblaze.domain.Listing;
import com.projektr.codeblaze.domain.Transaction;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.sql.Timestamp;
import java.time.LocalDateTime;

class TransactionTest {

    @Test
    void getPaymentTimestampTest() {
        Transaction transaction = new Transaction();
        LocalDateTime time = LocalDateTime.now();
        transaction.setPaymentTime(time);
        Assertions.assertEquals(Timestamp.valueOf(time), transaction.getPaymentTimestamp());
    }

    @Test
    void returnByTimeTestNull() {
        Transaction transaction = new Transaction();
        Assertions.assertNull(transaction.getPaymentTimestamp());

    }

}