package com.projektr.codeblaze.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.projektr.codeblaze.dao.ListingRepository;
import com.projektr.codeblaze.dao.TransactionRepository;
import com.projektr.codeblaze.domain.Listing;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionRepository transactionRepo;

    private final ListingRepository listingRepository;
    private final TransactionService transactionService;

    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);

    @Autowired
    public TransactionController(TransactionRepository transactionRepo, TransactionService transactionService,
                                 ListingRepository listingRepository) {
        this.transactionRepo = transactionRepo;
        this.transactionService = transactionService;
        this.listingRepository = listingRepository;
    }

    @GetMapping("owner/{userId}")
    public ResponseEntity<List<Transaction>> getTransactionsByOwnerUserId(@PathVariable Long userId) {
        List<Transaction> transactions = (List<Transaction>) transactionRepo.findAllByOwnerUserId(userId);

        if (transactions != null) {
            return ResponseEntity.ok(transactions);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("client/{userId}")
    public ResponseEntity<List<Transaction>> getTransactionsByClientUserId(@PathVariable Long userId) {
        List<Transaction> transactions = (List<Transaction>) transactionRepo.findAllByClientUserId(userId);

        if (transactions != null) {
            return ResponseEntity.ok(transactions);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("update-transaction-status/{transactionId}")
    public ResponseEntity<Transaction> updateTransactionStatus(@PathVariable Long transactionId, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        Transaction transaction = transactionService.updateTransactionStatus(transactionId, newStatus);
        return ResponseEntity.ok(transaction);
    }

    @PostMapping(value = "/send", consumes = "multipart/form-data")
    public ResponseEntity<Transaction> startTransaction(
            @RequestPart("kilometersTraveled") String kilometersTraveledJson,
            @RequestPart("totalPrice") String totalPriceJson,
            @RequestPart("paymentTime") String paymentTimeJson,
            @RequestPart("owner") String ownerJson,
            @RequestPart("client") String clientJson,
            @RequestPart("listingId") String listingIdJson) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());

            float kilometersTraveled = objectMapper.readValue(kilometersTraveledJson, Float.class);
            float totalPrice = objectMapper.readValue(totalPriceJson, Float.class);
            LocalDateTime paymentTime = objectMapper.readValue(paymentTimeJson, LocalDateTime.class);
            User owner = objectMapper.readValue(ownerJson, User.class);
            User client = objectMapper.readValue(clientJson, User.class);
            Long listingId = objectMapper.readValue(listingIdJson, Long.class);
            Listing listing = listingRepository.findById(listingId).orElseThrow();

            Transaction transaction = new Transaction();
            transaction.setKilometersTraveled(kilometersTraveled);
            transaction.setTotalPrice(totalPrice);
            transaction.setPaymentTime(paymentTime);
            transaction.setOwner(owner);
            transaction.setClient(client);
            transaction.setListing(listing);

            logger.debug("Deserialized transaction: {}", transaction);

            Transaction savedTransaction = transactionService.saveTransaction(transaction);
            logger.debug("Saved transaction: {}", savedTransaction);

            return new ResponseEntity<>(savedTransaction, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error processing transaction: ", e);
            return ResponseEntity.badRequest().build();
        }
    }


    @GetMapping("/get-by-id/{transactionId}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long transactionId) {
        return transactionService.getTransactionById(transactionId);
    }

}
