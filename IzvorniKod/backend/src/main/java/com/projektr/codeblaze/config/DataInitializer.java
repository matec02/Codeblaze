package com.projektr.codeblaze.config;

import com.projektr.codeblaze.domain.UserStatus;
import org.aspectj.weaver.BCException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.projektr.codeblaze.service.UserService;
import com.projektr.codeblaze.domain.User;
import com.projektr.codeblaze.domain.UserRole; // Import your Role enum
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class DataInitializer {

    private final UserService userService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();


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
            if (userService.getUserByNickname("Codeblaze") == null) {
                String encodedPassword = bCryptPasswordEncoder.encode("admin");
                User codeblaze = new User();
                codeblaze.setUserId(6L);
                codeblaze.setNickname("Codeblaze");
                codeblaze.setFirstName("Code");
                codeblaze.setLastName("Blaze");
                codeblaze.setPassword(encodedPassword); // Use a stronger password in production
                codeblaze.setRole(UserRole.ADMIN); // Use the enum value here
                codeblaze.setStatus(UserStatus.ACCEPTED);
                codeblaze.setEmail("codeblaze@gmail.com");
                codeblaze.setCardNumber("");
                codeblaze.setPhoneNumber("+38563224234");

                // Save the admin user using UserService
                userService.save(codeblaze);
            }
            if (userService.getUserByNickname("MLJ22") == null) {
                User marko = new User();
                marko.setUserId(2L);
                marko.setNickname("MLJ22");
                marko.setFirstName("Marko");
                marko.setLastName("Ljubić");
                marko.setPassword("marko");
                marko.setRole(UserRole.USER);
                marko.setStatus(UserStatus.BLOCKED);
                marko.setEmail("marko@gmail.com");
                marko.setCardNumber("123");
                marko.setPhoneNumber("+3859123");

                userService.save(marko);
            }
            if (userService.getUserByNickname("AA11") == null) {
                User ana = new User();
                ana.setUserId(3L);
                ana.setNickname("AA11");
                ana.setFirstName("Ana");
                ana.setLastName("Anić");
                ana.setPassword("ana");
                ana.setRole(UserRole.GUEST);
                ana.setStatus(UserStatus.REJECTED);
                ana.setEmail("ana@gmail.com");
                ana.setCardNumber("456");
                ana.setPhoneNumber("+38592456");

                userService.save(ana);
            }
            if (userService.getUserByNickname("II31") == null) {
                User ivo = new User();
                ivo.setUserId(4L);
                ivo.setNickname("II31");
                ivo.setFirstName("Ivo");
                ivo.setLastName("Ivić");
                ivo.setPassword("ivo");
                ivo.setRole(UserRole.USER);
                ivo.setStatus(UserStatus.ACCEPTED);
                ivo.setEmail("ivo@gmail.com");
                ivo.setCardNumber("367");
                ivo.setPhoneNumber("+38591367");

                userService.save(ivo);
            }

            if (userService.getUserByNickname("LL97") == null) {
                User luka = new User();
                luka.setUserId(5L);
                luka.setNickname("LL97");
                luka.setFirstName("Luka");
                luka.setLastName("Lukić");
                luka.setPassword("luka");
                luka.setRole(UserRole.GUEST);
                luka.setStatus(UserStatus.PENDING);
                luka.setEmail("luka@gmail.com");
                luka.setCardNumber("2865");
                luka.setPhoneNumber("+385972865");

                userService.save(luka);
            }
        };
    }
}