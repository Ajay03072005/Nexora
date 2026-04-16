package com.alumniHub.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Registration & Basic Info
    @Column(unique = true)
    private String registrationNumber;

    @Column(nullable = false)
    private String enrollmentNumber;

    @Column(nullable = false)
    private String name;

    @Column(name = "college_email", nullable = false, unique = true)
    private String collegeEmail;

    @Column(name = "email", unique = true)
    private String email;

    @Column(unique = true)
    private String personalEmail;

    @Column
    private String gender;

    @Column
    private String degree;

    @Column
    private String department;

    @Column
    private String careerPath;

    // Academic Info
    @Column
    private Double tenthPercentage;

    @Column
    private Double twelfthDiplomaPercentage;

    @Column
    private Double cgpa;

    @Column
    private Integer standingArrearsCount;

    @Column
    private Integer historyArrearsCount;

    @Column
    private String lmsPortalLevelCompletion;

    // Contact Info
    @Column
    private String mobileNumber;

    @Column
    private String whatsappNumber;

    // Address & Personal
    @Column(length = 500)
    private String fullAddress;

    @Column
    private String city;

    @Column
    private String state;

    @Column
    private String aadharNumber;

    @Column
    private String panNumber;

    // Skills & Achievements
    @Column(length = 500)
    private String technicalLanguagesKnown;

    @Column(length = 500)
    private String certificationsCompleted;

    @Column(length = 1000)
    private String achievements;

    @Column(length = 500)
    private String otherCommunicationLanguages;

    @Column
    private String semester;

    @Column
    private String courseName;

    @Column(length = 500)
    private String bio;

    @Column
    private String profilePicture;

    @Column
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    @PreUpdate
    private void syncEmailColumns() {
        if ((collegeEmail == null || collegeEmail.trim().isEmpty()) && email != null && !email.trim().isEmpty()) {
            collegeEmail = email.trim();
        }
        if ((email == null || email.trim().isEmpty()) && collegeEmail != null && !collegeEmail.trim().isEmpty()) {
            email = collegeEmail.trim();
        }
    }

}
