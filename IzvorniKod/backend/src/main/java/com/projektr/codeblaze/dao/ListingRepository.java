package com.projektr.codeblaze.dao;

import com.projektr.codeblaze.domain.Listing;
import com.projektr.codeblaze.domain.Scooter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long> {
    @Query("SELECT l FROM Listing l WHERE l.scooter.availability = true")
    List<Listing> findListingsByScooterAvailability();
    // Queries! TODO

    List<Listing> findByScooterScooterId(Long scooterId);

}
