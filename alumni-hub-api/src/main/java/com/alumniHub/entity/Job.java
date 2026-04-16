package com.alumniHub.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String company;

    @Column
    private String location;

    @Column
    private String jobType; // FULL_TIME, INTERNSHIP, PART_TIME

    @Column
    private String salary;

    @Column
    private String skillsRequired;

    @Column(nullable = false)
    private Long postedByAlumni;

    @Column
    private LocalDateTime postedDate = LocalDateTime.now();

    @Column(nullable = false)
    private Boolean isClosed = false;

}
