package com.alumniHub.controller;

import com.alumniHub.entity.User;
import com.alumniHub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    /**
     * User Login
     * @param loginRequest Contains email and password
     * @return User data if successful
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Optional<User> user = userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
            
            if (user.isPresent()) {
                LoginResponse response = new LoginResponse(
                    user.get().getId(),
                    user.get().getName(),
                    user.get().getEmail(),
                    user.get().getRole()
                );
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid email or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * User Signup / Registration
     * @param signupRequest Contains user details
     * @return Created user data
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        try {
            // Check if user already exists
            Optional<User> existingUser = userService.findByEmail(signupRequest.getEmail());
            if (existingUser.isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Email already exists");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
            }

            // Create new user
            User newUser = new User();
            newUser.setName(signupRequest.getName());
            newUser.setEmail(signupRequest.getEmail());
            newUser.setPassword(signupRequest.getPassword());
            newUser.setRole(signupRequest.getRole());
            newUser.setIsActive(true);

            User savedUser = userService.createUser(newUser);

            LoginResponse response = new LoginResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Signup failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Validate session - check if user is logged in
     */
    @GetMapping("/validate/{id}")
    public ResponseEntity<?> validateSession(@PathVariable Long id) {
        try {
            Optional<User> user = userService.getUserById(id);
            if (user.isPresent() && user.get().getIsActive()) {
                LoginResponse response = new LoginResponse(
                    user.get().getId(),
                    user.get().getName(),
                    user.get().getEmail(),
                    user.get().getRole()
                );
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "User not found or inactive");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Validation failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Inner classes for request/response
    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class SignupRequest {
        private String name;
        private String email;
        private String password;
        private String role;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    public static class LoginResponse {
        private Long id;
        private String name;
        private String email;
        private String role;

        public LoginResponse(Long id, String name, String email, String role) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
        }

        public Long getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
    }
}
