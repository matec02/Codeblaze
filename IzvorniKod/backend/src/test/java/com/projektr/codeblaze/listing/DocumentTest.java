package com.projektr.codeblaze.listing;

import com.projektr.codeblaze.domain.Document;
import com.projektr.codeblaze.domain.DocumentStatus;
import com.projektr.codeblaze.domain.User;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class DocumentTest {

    @Test
    void testDocumentProperties() {
        // Create a sample user
        User user = new User();
        user.setUserId(1L);
        user.setNickname("testUser");

        Document document = new Document();
        document.setUserId(1L);
        document.setUser(user);
        document.setStatus(DocumentStatus.PENDING);

        assertEquals(1L, document.getUserId());
        assertEquals(user, document.getUser());
        assertEquals(DocumentStatus.PENDING, document.getStatus());
    }

}

