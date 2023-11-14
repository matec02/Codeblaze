package com.projektr.codeblaze.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projektr.codeblaze.domain.User;
import com.projektr.codeblaze.domain.UserRole;
import com.projektr.codeblaze.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);


    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/by-nickname/{nickname}")
    public ResponseEntity<User> getUserByNickname(@PathVariable String nickname) {
        User user = userService.getUserByNickname(nickname);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/pendingUsers")
    public ResponseEntity<List<User>> getAllPendingUsers() {
        List<User> allUsers = userService.findAll();
        List<User> pendingUsers = userService.getAllPendingUsers(allUsers);
        if (pendingUsers.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(pendingUsers);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/acceptedUsers")
    public ResponseEntity<List<User>> getAllAcceptedUsers() {
        List<User> allUsers = userService.findAll();
        List<User> acceptedUsers = userService.getAllAcceptedUsers(allUsers);
        if (acceptedUsers.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(acceptedUsers);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/admins")
    public ResponseEntity<List<User>> getAllAdmins() {
        List<User> allUsers = userService.findAll();
        List<User> admins = userService.getAllAdmins(allUsers);
        if (admins.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(admins);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/blockedUsers")
    public ResponseEntity<List<User>> getAllBlockedUsers() {
        List<User> allUsers = userService.findAll();
        List<User> blockedUsers = userService.getAllBlockedUsers(allUsers);
        if (blockedUsers.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(blockedUsers);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/rejectedUsers")
    public ResponseEntity<List<User>> getAllRejectedUsers() {
        List<User> allUsers = userService.findAll();
        List<User> rejectedUsers = userService.getAllRejectedUsers(allUsers);
        if (rejectedUsers.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(rejectedUsers);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/{userId}/update-status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long userId, @RequestBody Map<String, String> updates) {
        String newStatus = updates.get("status");
        User user = userService.updateUserStatus(userId, newStatus);
        return ResponseEntity.ok(user);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/{userId}/update-role")
    public ResponseEntity<?> updateRoleStatus(@PathVariable Long userId, @RequestBody Map<String, String> updates) {
        String newRole = updates.get("role");
        User user = userService.updateUserRole(userId, newRole);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.findById(id);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestPart("user") String userJson) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            User user = objectMapper.readValue(userJson, User.class);

            User registeredUser = userService.register(user);
            if (registeredUser != null) {
                logger.info("User registered successfully");
                // Return the registered user or user ID here
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

    @CrossOrigin(origins = "http://localhost:3000")
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

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/upgrade-role/{userId}")
    public ResponseEntity<UserRole> upgradeUserRole(@PathVariable Long userId) {
        UserRole updatedRole = userService.upgradeUserRole(userId);

        if (updatedRole != null) {
            return ResponseEntity.ok(updatedRole);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.save(user);
    }
}
