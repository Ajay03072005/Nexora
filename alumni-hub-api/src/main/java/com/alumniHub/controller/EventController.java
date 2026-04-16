package com.alumniHub.controller;

import com.alumniHub.entity.Event;
import com.alumniHub.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "*")
public class EventController {

    @Autowired
    private EventService eventService;

    // Get all events
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    // Get event by ID
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Optional<Event> event = eventService.getEventById(id);
        return event.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get events by organizer
    @GetMapping("/organizer/{alumniId}")
    public ResponseEntity<List<Event>> getEventsByOrganizer(@PathVariable Long alumniId) {
        List<Event> events = eventService.getEventsByOrganizer(alumniId);
        return ResponseEntity.ok(events);
    }

    // Get events by type
    @GetMapping("/type/{eventType}")
    public ResponseEntity<List<Event>> getEventsByType(@PathVariable String eventType) {
        List<Event> events = eventService.getEventsByType(eventType);
        return ResponseEntity.ok(events);
    }

    // Create new event
    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        Event newEvent = eventService.createEvent(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(newEvent);
    }

    // Update event
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        Event updatedEvent = eventService.updateEvent(id, eventDetails);
        if (updatedEvent != null) {
            return ResponseEntity.ok(updatedEvent);
        }
        return ResponseEntity.notFound().build();
    }

    // Delete event
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

}
