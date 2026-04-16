package com.alumniHub.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "connection_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long fromUserId;

    @Column(nullable = false)
    private Long toUserId;

    @Column
    private String message;

    @Column
    private String requestType; // MENTOR_INVITE, MENTOR_ASSIGNMENT

    @Column
    private Long collegeId;

    @Column
    private Long studentId;

    @Column
    private Long alumniId;

    @Column
    private String topic;

    @Column
    private String sessionMode; // ONLINE, OFFLINE, HYBRID

    @Column
    private LocalDateTime preferredSessionDate;

    @Column
    private String status; // PENDING, ACCEPTED, REJECTED

    @Column
    private LocalDateTime requestDate = LocalDateTime.now();

    @Column
    private LocalDateTime responseDate;

    @Column
    private LocalDateTime assignedDate;

    @Column
    private LocalDateTime scheduledSessionDate;

    @Column
    private String meetingRoomId;

    @Column
    private String meetingProvider; // INTERNAL_PORTAL

    @Column(length = 2000)
    private String reportSummary;

    @Column(length = 2000)
    private String reportForStudent;

    @Column
    private Integer sessionMark;

    @Column
    private Boolean reportVisibleToStudent = false;

    @Column
    private Boolean reportVisibleToCollege = false;

    @Column
    private LocalDateTime reportGeneratedAt;

}
