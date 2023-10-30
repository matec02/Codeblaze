package com.projektr.codeblaze.service;

import com.projektr.codeblaze.dao.UserRepository;
import com.projektr.codeblaze.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private static UserRepository userRepository;

    public static User getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    public User createUser(User user) {
//        TODO
        return userRepository.save(user);
    }

    public User updateUser(Long userId, User updatedUser) {
        User existingUser = getUserById(userId);
        if (existingUser == null) {
            return null;
        }

        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());

        return userRepository.save(existingUser);
    }

    public boolean deleteUser(Long userId) {
        User userToDelete = getUserById(userId);
        if (userToDelete == null) {
            return false;
        }
        userRepository.delete(userToDelete);
        return true;
    }
}
