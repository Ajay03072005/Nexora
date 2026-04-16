package com.alumniHub.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "colleges")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class College {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column
    private String location;

    @Column
    private String contactNumber;

    @Column(length = 500)
    private String description;

    @Column
    private String logo;

    @Column
    private Integer totalStudents;

    @Column
    private Integer totalAlumni;

    @Column
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column
    private LocalDateTime updatedAt = LocalDateTime.now();

}
