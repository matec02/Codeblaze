package com.projektr.codeblaze.service;

import com.projektr.codeblaze.dao.UserRepository;
import com.projektr.codeblaze.domain.User;
import com.projektr.codeblaze.domain.UserRole;
import com.projektr.codeblaze.domain.UserStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private static UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

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

    public User register(User user) {
        String encodedPassword = bCryptPasswordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        user.setRole(UserRole.GUEST);
        user.setStatus(UserStatus.PENDING);
        return userRepository.save(user);
    }

    public User updateUserStatus(Long userId, String newStatus) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));

        user.setStatus(UserStatus.valueOf(newStatus));
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user != null && bCryptPasswordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }
}
