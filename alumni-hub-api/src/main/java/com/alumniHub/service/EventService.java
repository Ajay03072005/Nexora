package com.alumniHub.service;

import com.alumniHub.entity.Event;
import com.alumniHub.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    // Get all events
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // Get event by ID
    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    // Get events by organizer
    public List<Event> getEventsByOrganizer(Long alumniId) {
        return eventRepository.findByOrganizedBy(alumniId);
    }

    // Get events by type
    public List<Event> getEventsByType(String eventType) {
        return eventRepository.findByEventType(eventType);
    }

    // Create new event
    public Event createEvent(Event event) {
        event.setCreatedAt(LocalDateTime.now());
        return eventRepository.save(event);
    }

    // Update event
    public Event updateEvent(Long id, Event eventDetails) {
        Optional<Event> event = eventRepository.findById(id);
        if (event.isPresent()) {
            Event existingEvent = event.get();
            if (eventDetails.getTitle() != null) {
                existingEvent.setTitle(eventDetails.getTitle());
            }
            if (eventDetails.getDescription() != null) {
                existingEvent.setDescription(eventDetails.getDescription());
            }
            if (eventDetails.getEventDate() != null) {
                existingEvent.setEventDate(eventDetails.getEventDate());
            }
            if (eventDetails.getLocation() != null) {
                existingEvent.setLocation(eventDetails.getLocation());
            }
            return eventRepository.save(existingEvent);
        }
        return null;
    }

    // Delete event
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

}
