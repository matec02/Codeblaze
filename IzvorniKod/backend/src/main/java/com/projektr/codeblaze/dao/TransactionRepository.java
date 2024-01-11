package com.projektr.codeblaze.dao;

import com.projektr.codeblaze.domain.Transaction;
import com.projektr.codeblaze.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    public List<Transaction>  findAllByOwner(User user);
}
