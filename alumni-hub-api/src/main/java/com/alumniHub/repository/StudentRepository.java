package com.alumniHub.repository;

import com.alumniHub.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByCollegeEmail(String collegeEmail);
    Optional<Student> findByEnrollmentNumber(String enrollmentNumber);
    Optional<Student> findByRegistrationNumber(String registrationNumber);
    Optional<Student> findByPersonalEmail(String personalEmail);
}
