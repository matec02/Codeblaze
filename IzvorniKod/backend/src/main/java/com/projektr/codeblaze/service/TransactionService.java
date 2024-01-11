package com.projektr.codeblaze.service;

import com.projektr.codeblaze.dao.TransactionRepository;
import com.projektr.codeblaze.domain.Transaction;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;


@Service
public class TransactionService {

    private  final TransactionRepository transactionRepository;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository) { this.transactionRepository = transactionRepository; }

    public Transaction saveTransaction(Transaction transaction) { return transactionRepository.save(transaction); }
}
