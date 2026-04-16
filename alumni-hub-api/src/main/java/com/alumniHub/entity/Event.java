package com.alumniHub.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column
    private String eventType; // WEBINAR, MEETUP, WORKSHOP

    @Column
    private LocalDateTime eventDate;

    @Column
    private String location;

    @Column
    private String organizerName;

    @Column(nullable = false)
    private Long organizedBy; // Alumni ID

    @Column
    private LocalDateTime createdAt = LocalDateTime.now();

}
