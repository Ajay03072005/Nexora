-- Create Database
CREATE DATABASE IF NOT EXISTS alumni_hub_db;
USE alumni_hub_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    bio VARCHAR(500),
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Students Table
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    enrollment_number VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    department VARCHAR(100),
    semester VARCHAR(50),
    course_name VARCHAR(255),
    bio VARCHAR(500),
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Alumni Table
CREATE TABLE IF NOT EXISTS alumni (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    department VARCHAR(100),
    graduation_year VARCHAR(10),
    current_company VARCHAR(255),
    current_designation VARCHAR(255),
    industry VARCHAR(100),
    bio VARCHAR(500),
    profile_picture VARCHAR(255),
    is_available_for_hiring BOOLEAN DEFAULT false,
    is_available_for_mentoring BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Colleges Table
CREATE TABLE IF NOT EXISTS colleges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(255),
    contact_number VARCHAR(20),
    description VARCHAR(500),
    logo VARCHAR(255),
    total_students INT,
    total_alumni INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    job_type VARCHAR(50),
    salary VARCHAR(100),
    skills_required VARCHAR(500),
    posted_by_alumni BIGINT NOT NULL,
    posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_closed BOOLEAN DEFAULT false,
    FOREIGN KEY (posted_by_alumni) REFERENCES alumni(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Job Requests Table
CREATE TABLE IF NOT EXISTS job_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    status VARCHAR(50),
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_date TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (student_id) REFERENCES students(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    event_type VARCHAR(100),
    event_date TIMESTAMP,
    location VARCHAR(255),
    organizer_name VARCHAR(255),
    organized_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organized_by) REFERENCES alumni(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Connection Requests Table
CREATE TABLE IF NOT EXISTS connection_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    from_user_id BIGINT NOT NULL,
    to_user_id BIGINT NOT NULL,
    message VARCHAR(500),
    status VARCHAR(50),
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_date TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Indexes
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_alumni_email ON alumni(email);
CREATE INDEX idx_alumni_graduation_year ON alumni(graduation_year);
CREATE INDEX idx_jobs_company ON jobs(company);
CREATE INDEX idx_jobs_posted_by ON jobs(posted_by_alumni);
CREATE INDEX idx_job_requests_student ON job_requests(student_id);
CREATE INDEX idx_job_requests_job ON job_requests(job_id);
CREATE INDEX idx_events_organizer ON events(organized_by);
