package com.alumniHub.controller;

import com.alumniHub.entity.Alumni;
import com.alumniHub.service.AlumniService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/alumni")
@CrossOrigin(origins = "*")
public class AlumniController {

    @Autowired
    private AlumniService alumniService;

    // Get all alumni
    @GetMapping
    public ResponseEntity<List<Alumni>> getAllAlumni() {
        List<Alumni> alumni = alumniService.getAllAlumni();
        return ResponseEntity.ok(alumni);
    }

    // Get alumni by ID
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<Alumni> getAlumniById(@PathVariable Long id) {
        Optional<Alumni> alumni = alumniService.getAlumniById(id);
        return alumni.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get alumni by email
    @GetMapping("/email/{email}")
    public ResponseEntity<Alumni> getAlumniByEmail(@PathVariable String email) {
        Optional<Alumni> alumni = alumniService.getAlumniByEmail(email);
        return alumni.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get alumni by graduation year
    @GetMapping("/year/{year}")
    public ResponseEntity<List<Alumni>> getAlumniByYear(@PathVariable String year) {
        List<Alumni> alumni = alumniService.getAlumniByGraduationYear(year);
        return ResponseEntity.ok(alumni);
    }

    // Get available mentors
    @GetMapping("/mentors/available")
    public ResponseEntity<List<Alumni>> getAvailableMentors() {
        List<Alumni> mentors = alumniService.getAvailableMentors();
        return ResponseEntity.ok(mentors);
    }

    // Get available for hiring
    @GetMapping("/hiring/available")
    public ResponseEntity<List<Alumni>> getAvailableForHiring() {
        List<Alumni> alumni = alumniService.getAvailableForHiring();
        return ResponseEntity.ok(alumni);
    }

    // Create new alumni
    @PostMapping
    public ResponseEntity<Alumni> createAlumni(@RequestBody Alumni alumni) {
        Alumni newAlumni = alumniService.createAlumni(alumni);
        return ResponseEntity.status(HttpStatus.CREATED).body(newAlumni);
    }

    // Update alumni
    @PutMapping("/{id:\\d+}")
    public ResponseEntity<Alumni> updateAlumni(@PathVariable Long id, @RequestBody Alumni alumniDetails) {
        Alumni updatedAlumni = alumniService.updateAlumni(id, alumniDetails);
        if (updatedAlumni != null) {
            return ResponseEntity.ok(updatedAlumni);
        }
        return ResponseEntity.notFound().build();
    }

    // Delete alumni
    @DeleteMapping("/{id:\\d+}")
    public ResponseEntity<Void> deleteAlumni(@PathVariable Long id) {
        alumniService.deleteAlumni(id);
        return ResponseEntity.noContent().build();
    }

}
