package com.projektr.codeblaze.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.projektr.codeblaze.dao.TransactionRepository;
import com.projektr.codeblaze.domain.Transaction;
import com.projektr.codeblaze.domain.User;
import com.projektr.codeblaze.service.DocumentService;
import com.projektr.codeblaze.service.TransactionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionRepository transactionRepo;

    private final TransactionService transactionService;

    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);

    @Autowired
    public TransactionController(TransactionRepository transactionRepo, TransactionService transactionService) {
        this.transactionRepo = transactionRepo;
        this.transactionService = transactionService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Transaction>> getTransactionsByUserId(@PathVariable User userId) {
        List<Transaction> transactions = (List<Transaction>) transactionRepo.findAllByOwner(userId);

        if (transactions != null) {
            return ResponseEntity.ok(transactions);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping(value = "/send", consumes = "multipart/form-data")
    public ResponseEntity<Transaction> startTransaction(@RequestPart("transaction") String transactionJson) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());

            logger.debug("Received transaction JSON: {}", transactionJson);

            Transaction transaction = objectMapper.readValue(transactionJson, Transaction.class);
            logger.debug("Deserialized transaction: {}", transaction);

            Transaction savedTransaction = transactionService.saveTransaction(transaction);
            logger.debug("Saved transaction: {}", savedTransaction);

            return new ResponseEntity<>(savedTransaction, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error processing transaction: ", e);
            return ResponseEntity.badRequest().build();
        }
    }
}
