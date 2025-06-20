package com.projektr.codeblaze.service;

import com.projektr.codeblaze.dao.TransactionRepository;
import com.projektr.codeblaze.domain.Transaction;
import org.springframework.http.ResponseEntity;
import com.projektr.codeblaze.domain.TransactionStatus;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;
import java.util.NoSuchElementException;


@Service
public class TransactionService {

    private  final TransactionRepository transactionRepository;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository) { this.transactionRepository = transactionRepository; }

    public Transaction saveTransaction(Transaction transaction) { return transactionRepository.save(transaction); }

    public ResponseEntity<Transaction> getTransactionById(Long transactionId) {
        Optional<Transaction> transactionOptional = transactionRepository.getTransactionById(transactionId);
        return transactionOptional
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    public Transaction updateTransactionStatus(Long transactionId, String newStatus) {
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(NoSuchElementException::new);
        transaction.setStatus(TransactionStatus.valueOf(newStatus));
        return transactionRepository.save(transaction);
    }

}
