-- Sample Students Data
INSERT INTO students (enrollment_number, name, email, department, semester, course_name) VALUES
('STU001', 'John Doe', 'john.doe@student.com', 'Computer Science', '4th', 'B.Tech CS'),
('STU002', 'Jane Smith', 'jane.smith@student.com', 'Information Technology', '3rd', 'B.Tech IT'),
('STU003', 'Mike Johnson', 'mike.johnson@student.com', 'Computer Science', '2nd', 'B.Tech CS'),
('STU004', 'Sarah Williams', 'sarah.williams@student.com', 'Electronics', '4th', 'B.Tech ECE');

-- Sample Alumni Data
INSERT INTO alumni (name, email, department, graduation_year, current_company, current_designation, industry, is_available_for_hiring, is_available_for_mentoring) VALUES
('Rajesh Kumar', 'rajesh.kumar@alumni.com', 'Computer Science', '2020', 'Google', 'Software Engineer', 'Technology', true, true),
('Priya Sharma', 'priya.sharma@alumni.com', 'Information Technology', '2019', 'Microsoft', 'Senior Developer', 'Technology', true, true),
('Amit Patel', 'amit.patel@alumni.com', 'Computer Science', '2018', 'Amazon', 'Tech Lead', 'Technology', false, true),
('Ananya Gupta', 'ananya.gupta@alumni.com', 'Electronics', '2021', 'Intel', 'Hardware Engineer', 'Technology', true, false);

-- Sample Jobs Data
INSERT INTO jobs (title, description, company, location, job_type, salary, skills_required, posted_by_alumni, is_closed) VALUES
('Junior Java Developer', 'Looking for Junior Java Developer with 1-2 years experience', 'Google', 'Bangalore', 'FULL_TIME', '6-8 LPA', 'Java, Spring Boot, MySQL', 1, false),
('Frontend Developer Internship', 'Internship opportunity for Frontend Developer', 'Microsoft', 'Hyderabad', 'INTERNSHIP', 'Stipend: 15000', 'React, JavaScript, HTML, CSS', 2, false),
('DevOps Engineer', 'DevOps Engineer needed for cloud infrastructure', 'Amazon', 'Pune', 'FULL_TIME', '10-12 LPA', 'Docker, Kubernetes, AWS', 3, false),
('Full Stack Developer', 'Full Stack Developer for web applications', 'Google', 'Bangalore', 'FULL_TIME', '8-10 LPA', 'Java, React, MySQL, AWS', 1, false);

-- Sample Events Data
INSERT INTO events (title, description, event_type, event_date, location, organizer_name, organized_by) VALUES
('Tech Talk: Cloud Computing', 'Discussion about latest cloud technologies', 'WEBINAR', '2026-05-15 10:00:00', 'Online', 'Rajesh Kumar', 1),
('Alumni Meetup', 'Annual alumni reunion and networking', 'MEETUP', '2026-06-01 18:00:00', 'New Delhi', 'Priya Sharma', 2),
('Workshop: Machine Learning', 'Hands-on workshop on ML basics', 'WORKSHOP', '2026-05-20 09:00:00', 'Bangalore', 'Amit Patel', 3);

-- Sample Job Requests
INSERT INTO job_requests (job_id, student_id, status, applied_date) VALUES
(1, 1, 'PENDING', NOW()),
(1, 2, 'PENDING', NOW()),
(2, 3, 'ACCEPTED', NOW()),
(4, 1, 'PENDING', NOW());
