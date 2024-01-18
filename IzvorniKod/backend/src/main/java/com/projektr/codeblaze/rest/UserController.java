package com.projektr.codeblaze.rest;

import com.projektr.codeblaze.domain.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projektr.codeblaze.service.DocumentService;
import com.projektr.codeblaze.service.PrivacySettingsService;
import com.projektr.codeblaze.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    private final DocumentService documentService;

    private final PrivacySettingsService privacySettingsService;

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);


    @Autowired
    public UserController(UserService userService, DocumentService documentService,
                          PrivacySettingsService privacySettingsService) {
        this.documentService = documentService;
        this.userService = userService;
        this.privacySettingsService = privacySettingsService;
    }


    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody User updatedUser) {
        try {

            User existingUser = userService.findById(updatedUser.getUserId());

            if (existingUser != null) {
                existingUser.setFirstName(updatedUser.getFirstName());
                existingUser.setLastName(updatedUser.getLastName());
                existingUser.setNickname(updatedUser.getNickname());
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setPhoneNumber(updatedUser.getPhoneNumber());


                userService.save(existingUser);
                return ResponseEntity.ok("Profile updated successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating profile");
        }
    }


    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    @GetMapping("/by-nickname/{nickname}")
    public ResponseEntity<User> getUserByNickname(@PathVariable String nickname) {
        User user = userService.getUserByNickname(nickname);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/pendingUsers")
    public ResponseEntity<List<User>> getAllPendingUsers() {
        List<User> allUsers = userService.findAll();
        List<User> pendingUsers = userService.getAllPendingUsers(allUsers);
        return ResponseEntity.ok(pendingUsers);
    }

    @GetMapping("/acceptedUsers")
    public ResponseEntity<List<User>> getAllAcceptedUsers() {
        List<User> allUsers = userService.findAll();
        List<User> acceptedUsers = userService.getAllAcceptedUsers(allUsers);
        return ResponseEntity.ok(acceptedUsers);
    }

    @GetMapping("/admins")
    public ResponseEntity<List<User>> getAllAdmins() {
        List<User> allUsers = userService.findAll();
        List<User> admins = userService.getAllAdmins(allUsers);
        return ResponseEntity.ok(admins);
    }

    @GetMapping("/blockedUsers")
    public ResponseEntity<List<User>> getAllBlockedUsers() {
        List<User> allUsers = userService.findAll();
        List<User> blockedUsers = userService.getAllBlockedUsers(allUsers);
        return ResponseEntity.ok(blockedUsers);
    }

    @GetMapping("/rejectedUsers")
    public ResponseEntity<List<User>> getAllRejectedUsers() {
        List<User> allUsers = userService.findAll();
        List<User> rejectedUsers = userService.getAllRejectedUsers(allUsers);
        return ResponseEntity.ok(rejectedUsers);
    }

    @PutMapping("/{userId}/update-status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long userId, @RequestBody Map<String, String> updates) {
        String newStatus = updates.get("status");
        User user = userService.updateUserStatus(userId, newStatus);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{userId}/update-role")
    public ResponseEntity<?> updateRoleStatus(@PathVariable Long userId, @RequestBody Map<String, String> updates) {
        String newRole = updates.get("role");
        User user = userService.updateUserRole(userId, newRole);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        User user = userService.findById(userId);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestPart("user") String userJson) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            User user = objectMapper.readValue(userJson, User.class);

            User registeredUser = userService.register(user);
            if (registeredUser != null) {
                logger.info("User registered successfully");

                return ResponseEntity.ok(registeredUser);
            } else {
                logger.debug("Registered User is null");
                return ResponseEntity.badRequest().body("Registration failed");
            }
        } catch (Exception e) {
            logger.error("Error during registration", e);
            return ResponseEntity.internalServerError().body("Registration error");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        User user = userService.login(email, password);
        if (user != null) {
            Map<String, Object> claims = new HashMap<>();
            UserRole userRole = user.getRole() != null ? user.getRole() : UserRole.USER;

            claims.put("role", userRole);
            claims.put("nickname", user.getNickname());
            Map<String, String> response = new HashMap<>();
            response.put("message", "User logged in successfully");
            response.put("authToken",
                    userService.generateJWTToken(user, claims)
            );
            response.put("status", user.getStatus().getCode());
            return ResponseEntity.ok().body(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @PutMapping("/upgrade-role/{userId}")
    public ResponseEntity<UserRole> upgradeUserRole(@PathVariable Long userId) {
        UserRole updatedRole = userService.upgradeUserRole(userId);
        return ResponseEntity.ok(updatedRole);
    }


    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.save(user);
    }
}
