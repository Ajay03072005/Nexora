package com.alumniHub.service;

import com.alumniHub.entity.Student;
import com.alumniHub.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    // Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get student by ID
    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    // Get student by college email
    public Optional<Student> getStudentByEmail(String collegeEmail) {
        return studentRepository.findByCollegeEmail(collegeEmail);
    }

    // Get student by enrollment number
    public Optional<Student> getStudentByEnrollmentNumber(String enrollmentNumber) {
        return studentRepository.findByEnrollmentNumber(enrollmentNumber);
    }

    // Get student by registration number
    public Optional<Student> getStudentByRegistrationNumber(String registrationNumber) {
        return studentRepository.findByRegistrationNumber(registrationNumber);
    }

    // Get student by personal email
    public Optional<Student> getStudentByPersonalEmail(String personalEmail) {
        return studentRepository.findByPersonalEmail(personalEmail);
    }

    // Create new student
    public Student createStudent(Student student) {
        student.setCreatedAt(LocalDateTime.now());
        student.setUpdatedAt(LocalDateTime.now());
        return studentRepository.save(student);
    }

    // Update student
    public Student updateStudent(Long id, Student studentDetails) {
        Optional<Student> student = studentRepository.findById(id);
        if (student.isPresent()) {
            Student existingStudent = student.get();
            if (studentDetails.getName() != null) {
                existingStudent.setName(studentDetails.getName());
            }
            if (studentDetails.getCollegeEmail() != null) {
                existingStudent.setCollegeEmail(studentDetails.getCollegeEmail());
            }
            if (studentDetails.getDepartment() != null) {
                existingStudent.setDepartment(studentDetails.getDepartment());
            }
            if (studentDetails.getBio() != null) {
                existingStudent.setBio(studentDetails.getBio());
            }
            existingStudent.setUpdatedAt(LocalDateTime.now());
            return studentRepository.save(existingStudent);
        }
        return null;
    }

    // Delete student
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

}
