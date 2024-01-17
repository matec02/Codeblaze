package com.projektr.codeblaze.unitTests;

import com.projektr.codeblaze.domain.User;
import com.projektr.codeblaze.domain.UserRole;
import com.projektr.codeblaze.domain.UserStatus;
import jakarta.jws.soap.SOAPBinding;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class UserTest {

    @Test
    void testUserProperties() {

        User user = new User();
        user.setUserId(1L);
        user.setNickname("testUser");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setCardNumber("1234567890123456");
        user.setEmail("john.doe@example.com");
        user.setPhoneNumber("+1234567890");
        user.setPassword("securePassword");
        user.setRole(UserRole.USER);
        user.setStatus(UserStatus.ACCEPTED);

        assertEquals(1L, user.getUserId());
        assertEquals("testUser", user.getNickname());
        assertEquals("John", user.getFirstName());
        assertEquals("Doe", user.getLastName());
        assertEquals("1234567890123456", user.getCardNumber());
        assertEquals("john.doe@example.com", user.getEmail());
        assertEquals("+1234567890", user.getPhoneNumber());
        assertEquals("securePassword", user.getPassword());
        assertEquals(UserRole.USER, user.getRole());
        assertEquals(UserStatus.ACCEPTED, user.getStatus());
    }

}
