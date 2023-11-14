package com.projektr.codeblaze.config;

import com.projektr.codeblaze.domain.UserStatus;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.projektr.codeblaze.service.UserService;
import com.projektr.codeblaze.domain.User;
import com.projektr.codeblaze.domain.UserRole; // Import your Role enum

@Configuration
public class DataInitializer {

    private final UserService userService;

    // Constructor for dependency injection
    public DataInitializer(UserService userService) {
        this.userService = userService;
    }

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            // Check if admin user already exists to avoid creating multiple entries
            if (userService.getUserByNickname("admin") == null) {
                // Create the admin user
                User admin = new User();
                admin.setUserId(1L);
                admin.setNickname("admin");
                admin.setFirstName("first");
                admin.setLastName("admin");
                admin.setPassword("admin"); // Use a stronger password in production
                admin.setRole(UserRole.ADMIN); // Use the enum value here
                admin.setStatus(UserStatus.ACCEPTED);
                admin.setEmail("admin@gmail.com");
                admin.setCardNumber("");
                admin.setPhoneNumber("");

                // Save the admin user using UserService
                userService.save(admin);
            }
        };
    }
}