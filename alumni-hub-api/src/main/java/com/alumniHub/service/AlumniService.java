package com.alumniHub.service;

import com.alumniHub.entity.Alumni;
import com.alumniHub.repository.AlumniRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AlumniService {

    @Autowired
    private AlumniRepository alumniRepository;

    // Get all alumni
    public List<Alumni> getAllAlumni() {
        return alumniRepository.findAll();
    }

    // Get alumni by ID
    public Optional<Alumni> getAlumniById(Long id) {
        return alumniRepository.findById(id);
    }

    // Get alumni by email
    public Optional<Alumni> getAlumniByEmail(String email) {
        return alumniRepository.findByEmail(email);
    }

    // Get alumni by graduation year
    public List<Alumni> getAlumniByGraduationYear(String year) {
        return alumniRepository.findByGraduationYear(year);
    }

    // Get available mentors
    public List<Alumni> getAvailableMentors() {
        return alumniRepository.findByIsAvailableForMentoringTrue();
    }

    // Get available for hiring
    public List<Alumni> getAvailableForHiring() {
        return alumniRepository.findByIsAvailableForHiringTrue();
    }

    // Create new alumni
    public Alumni createAlumni(Alumni alumni) {
        alumni.setCreatedAt(LocalDateTime.now());
        alumni.setUpdatedAt(LocalDateTime.now());
        return alumniRepository.save(alumni);
    }

    // Update alumni
    public Alumni updateAlumni(Long id, Alumni alumniDetails) {
        Optional<Alumni> alumni = alumniRepository.findById(id);
        if (alumni.isPresent()) {
            Alumni existingAlumni = alumni.get();
            if (alumniDetails.getName() != null) {
                existingAlumni.setName(alumniDetails.getName());
            }
            if (alumniDetails.getCurrentCompany() != null) {
                existingAlumni.setCurrentCompany(alumniDetails.getCurrentCompany());
            }
            if (alumniDetails.getCurrentDesignation() != null) {
                existingAlumni.setCurrentDesignation(alumniDetails.getCurrentDesignation());
            }
            if (alumniDetails.getBio() != null) {
                existingAlumni.setBio(alumniDetails.getBio());
            }
            if (alumniDetails.getIsAvailableForHiring() != null) {
                existingAlumni.setIsAvailableForHiring(alumniDetails.getIsAvailableForHiring());
            }
            if (alumniDetails.getIsAvailableForMentoring() != null) {
                existingAlumni.setIsAvailableForMentoring(alumniDetails.getIsAvailableForMentoring());
            }
            existingAlumni.setUpdatedAt(LocalDateTime.now());
            return alumniRepository.save(existingAlumni);
        }
        return null;
    }

    // Delete alumni
    public void deleteAlumni(Long id) {
        alumniRepository.deleteById(id);
    }

}
