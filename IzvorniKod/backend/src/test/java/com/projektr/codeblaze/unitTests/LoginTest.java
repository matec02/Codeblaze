package com.projektr.codeblaze.unitTests;

import com.projektr.codeblaze.dao.UserRepository;
import com.projektr.codeblaze.domain.User;

import com.projektr.codeblaze.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

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
        userService = new UserService(userRepository);
    }

    @Test
    void testValidUserLogin() {
        String email = "test@example.com";
        String password = "password";
        String encodedPassword = new BCryptPasswordEncoder().encode(password);

        Mockito.when(mockUser.getEmail()).thenReturn(email);
        Mockito.when(mockUser.getPassword()).thenReturn(encodedPassword);

        Mockito.when(userRepository.findByEmail(email)).thenReturn(mockUser);
        User result = userService.login(email, password);

        assertEquals(mockUser, result, "Rezultati su jednaki");
    }

    @Test
    void testInvalidUserLogin() {

        UserService userService = new UserService(userRepository);

        Mockito.when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(null);

        User result = userService.login("nonexistent@example.com", "wrongPassword");

        assertNull(result);
    }
}
