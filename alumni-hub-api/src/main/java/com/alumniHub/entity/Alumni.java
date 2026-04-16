package com.alumniHub.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alumni")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alumni {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column
    private String department;

    @Column
    private String graduationYear;

    @Column
    private String currentCompany;

    @Column
    private String currentDesignation;

    @Column
    private String industry;

    @Column(length = 500)
    private String bio;

    @Column
    private String profilePicture;

    @Column(nullable = false)
    private Boolean isAvailableForHiring = false;

    @Column(nullable = false)
    private Boolean isAvailableForMentoring = false;

    @Column
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column
    private LocalDateTime updatedAt = LocalDateTime.now();

}
