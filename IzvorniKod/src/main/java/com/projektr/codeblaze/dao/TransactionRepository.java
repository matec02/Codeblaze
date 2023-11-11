package com.projektr.codeblaze.dao;

import com.projektr.codeblaze.domain.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Queries! TODO
}
