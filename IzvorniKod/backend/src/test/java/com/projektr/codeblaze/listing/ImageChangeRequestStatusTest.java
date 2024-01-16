package com.projektr.codeblaze.listing;

import com.projektr.codeblaze.domain.ImageChangeRequest;
import com.projektr.codeblaze.domain.ImageChangeRequestStatus;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ImageChangeRequestStatusTest {

    @Test
    void testEnumValues() {

        assertEquals("APPROVED", ImageChangeRequestStatus.APPROVED.getCode());
        assertEquals("REJECTED", ImageChangeRequestStatus.REJECTED.getCode());
        assertEquals("PENDING", ImageChangeRequestStatus.PENDING.getCode());

        assertEquals("Approved", ImageChangeRequestStatus.APPROVED.getDisplayValue());
        assertEquals("Rejected", ImageChangeRequestStatus.REJECTED.getDisplayValue());
        assertEquals("Pending", ImageChangeRequestStatus.PENDING.getDisplayValue());
    }

    @Test
    void testEnumToString() {
        assertEquals("APPROVED", ImageChangeRequestStatus.APPROVED.toString());
        assertEquals("REJECTED", ImageChangeRequestStatus.REJECTED.toString());
        assertEquals("PENDING", ImageChangeRequestStatus.PENDING.toString());
    }

}