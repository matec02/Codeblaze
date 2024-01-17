package com.projektr.codeblaze.dao;

import com.projektr.codeblaze.domain.Transaction;
import com.projektr.codeblaze.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    public List<Transaction>  findAllByOwnerUserId(Long userId);
    public List<Transaction> findAllByClientUserId(Long userId);

    @Query("SELECT t FROM Transaction t WHERE t.transactionId = :transactionId")
    Optional<Transaction> getTransactionById(Long transactionId);

}
