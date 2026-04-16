package com.alumniHub.service;

import com.alumniHub.entity.User;
import com.alumniHub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Authenticate user with email and password
     */
    public Optional<User> authenticateUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user;
        }
        return Optional.empty();
    }

    /**
     * Find user by email
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Get user by ID
     */
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Create new user
     */
    public User createUser(User user) {
        return userRepository.save(user);
    }

    /**
     * Update user
     */
    public User updateUser(Long id, User userDetails) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            User existingUser = user.get();
            if (userDetails.getName() != null) {
                existingUser.setName(userDetails.getName());
            }
            if (userDetails.getPassword() != null) {
                existingUser.setPassword(userDetails.getPassword());
            }
            if (userDetails.getRole() != null) {
                existingUser.setRole(userDetails.getRole());
            }
            return userRepository.save(existingUser);
        }
        return null;
    }

    /**
     * Get all users
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Find users by role
     */
    public List<User> findByRole(String role) {
        // Filter users by role from all users
        return userRepository.findAll().stream()
            .filter(user -> user.getRole().equalsIgnoreCase(role))
            .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Delete user
     */
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
