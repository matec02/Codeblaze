package com.projektr.codeblaze.service;

import com.projektr.codeblaze.dao.UserRepository;
import com.projektr.codeblaze.domain.PrivacySettings;
import com.projektr.codeblaze.domain.User;
import com.projektr.codeblaze.domain.UserRole;
import com.projektr.codeblaze.domain.UserStatus;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.SignatureException;
import jakarta.transaction.Transactional;
import jakarta.xml.bind.DatatypeConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {
    private static UserRepository userRepository;

    @Autowired
    private PrivacySettingsService privacySettingsService;

    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

    @Value("${secretKey}")
    private String secretKey;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    public List<User> findAll() {
        return userRepository.findAll();
    }
    public User save(User user) {
        return userRepository.save(user);
    }

    public static Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    @Transactional
    public User register(User user) {
        String encodedPassword = bCryptPasswordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        user.setRole(UserRole.GUEST);
        user.setStatus(UserStatus.PENDING);
        User savedUser = userRepository.save(user);

        // Initialize Privacy Settings for the user
        PrivacySettings privacySettings = new PrivacySettings();
        privacySettings.setUser(savedUser);
        privacySettings.setFirstNameVisible(false);
        privacySettings.setLastNameVisible(false);
        privacySettings.setEmailVisible(false);
        privacySettings.setPhoneNumberVisible(false);
        privacySettingsService.initializePrivacySettings(privacySettings);

        return savedUser;
    }



    public User login(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user != null && bCryptPasswordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }

    public User getUserByNickname(String nickname) {
        return userRepository.findByNickname(nickname);
    }

    public List<User> getAllPendingUsers(List<User> allUsers) {
        return allUsers.stream()
                .filter(user -> "PENDING".equals(user.getStatus().getCode()))
                .collect(Collectors.toList());
    }

    public List<User> getAllAcceptedUsers(List<User> allUsers) {
        return allUsers.stream()
                .filter(user -> "ACCEPTED".equals(user.getStatus().getCode()))
                .filter(user -> !user.getRole().getCode().equals("ADMIN"))
                .collect(Collectors.toList());
    }

    public List<User> getAllAdmins(List<User> allUsers){
        return allUsers.stream()
                .filter(user -> "ADMIN".equals(user.getRole().getCode()))
                .collect(Collectors.toList());
    }

    public List<User> getAllBlockedUsers(List<User> allUsers) {
        return allUsers.stream()
                .filter(user -> "BLOCKED".equals(user.getStatus().getCode()))
                .collect(Collectors.toList());
    }

    public List<User> getAllRejectedUsers(List<User> allUsers) {
        return allUsers.stream()
                .filter(user -> "REJECTED".equals(user.getStatus().getCode()))
                .collect(Collectors.toList());
    }

    public User updateUserStatus(Long userId, String newStatus) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));

        user.setStatus(UserStatus.valueOf(newStatus));
        return userRepository.save(user);
    }

    public User updateUserRole(Long userId, String newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));

        user.setRole(UserRole.valueOf(newRole));
        return userRepository.save(user);
    }

    public String generateJWTToken(User user, Map<String, Object> claims){
        byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(secretKey);
        Key signingKey = new SecretKeySpec(apiKeySecretBytes, SignatureAlgorithm.HS512.getJcaName());

        String token = Jwts.builder()
                .setSubject(user.getNickname())
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 3600000)) // expiration: 1 hour
                .signWith(SignatureAlgorithm.HS512, signingKey)
                .compact();
        return token;
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(secretKey.getBytes())
                    .parseClaimsJws(token);

            return true;
        } catch (SignatureException ex) {
        } catch (ExpiredJwtException ex) {
        } catch (Exception ex) {
        }

        return false;
    }

    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();

        String username = claims.getSubject();

        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(UserRole.USER.getCode());

        return new UsernamePasswordAuthenticationToken(username, null, Collections.singletonList(authority));
    }

    public UserRole upgradeUserRole(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setRole(UserRole.RENTER);
            userRepository.save(user);
            return user.getRole();
        }
        return null;
    }
}
