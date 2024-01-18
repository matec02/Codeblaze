package com.projektr.codeblaze.config;

import com.projektr.codeblaze.domain.UserStatus;
import com.projektr.codeblaze.service.PrivacySettingsService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.projektr.codeblaze.service.UserService;
import com.projektr.codeblaze.domain.User;
import com.projektr.codeblaze.domain.UserRole;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class DataInitializer {

    private final UserService userService;
    private final PrivacySettingsService privacySettingsService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

    public DataInitializer(UserService userService, PrivacySettingsService privacySettingsService) {

        this.userService = userService;
        this.privacySettingsService = privacySettingsService;
    }

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            createUserIfNotExists("admin", "first", "admin",
                    bCryptPasswordEncoder.encode("admin"), UserRole.ADMIN,
                    UserStatus.ACCEPTED, "admin@gmail.com", "1234 5678 9012 3456",
                    "+385 91 123 4567");

            createUserIfNotExists("Codeblaze", "Code", "Blaze",
                    bCryptPasswordEncoder.encode("admin"), UserRole.ADMIN,
                    UserStatus.ACCEPTED, "codeblaze@gmail.com", "2345 6789 0123 4567",
                    "+385 92 234 5678");

            createUserIfNotExists("MLJ22", "Marko", "Ljubić",
                    bCryptPasswordEncoder.encode("marko"), UserRole.USER,
                    UserStatus.BLOCKED, "marko@gmail.com", "3456 7890 1234 5678",
                    "+385 93 345 6789");

            createUserIfNotExists("AA11", "Ana", "Anić",
                    bCryptPasswordEncoder.encode("ana"), UserRole.USER,
                    UserStatus.REJECTED, "ana@gmail.com", "4567 8901 2345 6789",
                    "+385 94 456 7890");

            createUserIfNotExists("II31", "Ivo", "Ivić",
                    bCryptPasswordEncoder.encode("ivo"), UserRole.USER,
                    UserStatus.ACCEPTED, "ivo@gmail.com", "5678 9012 3456 7890",
                    "+385 95 567 8901");

            createUserIfNotExists("LL97", "Luka", "Lukić",
                    bCryptPasswordEncoder.encode("luka"), UserRole.USER,
                    UserStatus.PENDING, "luka@gmail.com", "6789 0123 4567 8901",
                    "+385 96 678 9012");

        };
    }

    private void createUserIfNotExists(String nickname, String firstName, String lastName, String password, UserRole role, UserStatus status, String email, String cardNumber, String phoneNumber) {
        if (userService.getUserByNickname(nickname) == null) {
            User user = new User();
            user.setNickname(nickname);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setPassword(password);
            user.setRole(role);
            user.setStatus(status);
            user.setEmail(email);
            user.setCardNumber(cardNumber);
            user.setPhoneNumber(phoneNumber);
            user = userService.save(user);

        }
    }
}