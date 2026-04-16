package com.alumniHub.repository;

import com.alumniHub.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByOrganizedBy(Long alumniId);
    List<Event> findByEventType(String eventType);
}
