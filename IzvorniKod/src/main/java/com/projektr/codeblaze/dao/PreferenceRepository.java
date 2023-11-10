package com.projektr.codeblaze.dao;

import com.projektr.codeblaze.domain.Preference;
import com.projektr.codeblaze.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PreferenceRepository extends JpaRepository<Preference, User>{
    // Queries! TODO
}
