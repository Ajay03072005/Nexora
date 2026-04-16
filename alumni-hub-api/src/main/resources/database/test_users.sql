-- Insert demo/test user accounts
INSERT INTO users (email, password, name, role, bio, profile_picture, created_at, updated_at, is_active) VALUES
('student@college.edu', 'password123', 'Priya Sharma', 'student', 'I am a computer science student', NULL, NOW(), NOW(), true),
('alumni@college.edu', 'password123', 'Dr. Rajesh Kumar', 'alumni', 'Senior Software Engineer at Google', NULL, NOW(), NOW(), true),
('college@admin.edu', 'password123', 'College Administrator', 'college', 'College admin account', NULL, NOW(), NOW(), true);

-- Verify insertion
SELECT * FROM users;
