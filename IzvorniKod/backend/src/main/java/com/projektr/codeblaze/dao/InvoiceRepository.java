package com.projektr.codeblaze.dao;

import com.projektr.codeblaze.domain.Invoice;
import com.projektr.codeblaze.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, User>{
    // Queries! TODO
}
