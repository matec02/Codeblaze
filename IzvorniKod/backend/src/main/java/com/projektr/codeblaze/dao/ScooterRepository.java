package com.projektr.codeblaze.dao;

import com.projektr.codeblaze.domain.Scooter;
import com.projektr.codeblaze.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScooterRepository extends JpaRepository<Scooter, Long> {
    List<Scooter> findByUser(User user);
    @Query("SELECT s FROM Scooter s WHERE s.availability = :availability")
    List<Scooter> findByAvailability(@Param("availability") boolean availability);

    // Queries TODO
}
