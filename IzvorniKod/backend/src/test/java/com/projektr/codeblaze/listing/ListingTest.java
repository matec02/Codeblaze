package com.projektr.codeblaze.listing;

import com.projektr.codeblaze.domain.Listing;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.sql.Timestamp;
import java.time.LocalDateTime;

public class ListingTest {

    @Test
    void returnByTimeTest() {
        Listing listing = new Listing();
        LocalDateTime time = LocalDateTime.now();
        listing.setReturnByTime(time);

        Assertions.assertEquals(Timestamp.valueOf(time), listing.getReturnByTime());
    }

    @Test
    void returnByTimeTestNull() {
        Listing listing = new Listing();
        Assertions.assertNull(listing.getReturnByTime());
    }


}
