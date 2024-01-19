package com.projektr.codeblaze.unitTests;

import com.projektr.codeblaze.dao.UserRepository;
import com.projektr.codeblaze.domain.User;

import com.projektr.codeblaze.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@SpringBootTest
public class LoginTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Mock
    private User mockUser;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testValidUserLogin() {

        String admin = "admin";

        Mockito.when(mockUser.getNickname()).thenReturn(admin);
        Mockito.when(mockUser.getPassword()).thenReturn(admin);

        Mockito.when(userService.login("test@example.com", "password")).thenReturn(mockUser);

        User result = userService.login("test@example.com", "password");

        assertEquals(mockUser, result);
    }

    @Test
    void testInvalidUserLogin() {

        UserService userService = new UserService(userRepository);

        Mockito.when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(null);

        User result = userService.login("nonexistent@example.com", "wrongPassword");

        assertNull(result);
    }
}
