package com.projektr.codeblaze.service;

import com.projektr.codeblaze.dao.UserRepository;
import com.projektr.codeblaze.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private static UserRepository userRepository;

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
}
