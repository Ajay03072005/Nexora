package com.alumniHub.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long jobId;

    @Column(nullable = false)
    private Long studentId;

    @Column
    private String status; // PENDING, ACCEPTED, REJECTED

    @Column
    private LocalDateTime appliedDate = LocalDateTime.now();

    @Column
    private LocalDateTime responseDate;

}
