package com.projektr.codeblaze.rest;

import com.projektr.codeblaze.dao.TransactionRepository;
import com.projektr.codeblaze.domain.Transaction;
import com.projektr.codeblaze.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionRepository transactionRepo;

    @Autowired
    public TransactionController(TransactionRepository transactionRepo) {
        this.transactionRepo = transactionRepo;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Transaction>> getTransactionsByUserId(@PathVariable User userId) {
        List<Transaction> transactions = (List<Transaction>) transactionRepo.findAllByOwnerId(userId);

        if (transactions != null) {
            return ResponseEntity.ok(transactions);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
