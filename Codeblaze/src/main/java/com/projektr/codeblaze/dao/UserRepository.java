package com.projektr.codeblaze.dao;

import com.projektr.codeblaze.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}
