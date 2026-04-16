package com.alumniHub.service;

import com.alumniHub.entity.College;
import com.alumniHub.repository.CollegeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CollegeService {

    @Autowired
    private CollegeRepository collegeRepository;

    // Get all colleges
    public List<College> getAllColleges() {
        return collegeRepository.findAll();
    }

    // Get college by ID
    public Optional<College> getCollegeById(Long id) {
        return collegeRepository.findById(id);
    }

    // Get college by email
    public Optional<College> getCollegeByEmail(String email) {
        return collegeRepository.findByEmail(email);
    }

    // Create new college
    public College createCollege(College college) {
        college.setCreatedAt(LocalDateTime.now());
        college.setUpdatedAt(LocalDateTime.now());
        return collegeRepository.save(college);
    }

    // Update college
    public College updateCollege(Long id, College collegeDetails) {
        Optional<College> college = collegeRepository.findById(id);
        if (college.isPresent()) {
            College existingCollege = college.get();
            if (collegeDetails.getName() != null) {
                existingCollege.setName(collegeDetails.getName());
            }
            if (collegeDetails.getDescription() != null) {
                existingCollege.setDescription(collegeDetails.getDescription());
            }
            if (collegeDetails.getLocation() != null) {
                existingCollege.setLocation(collegeDetails.getLocation());
            }
            if (collegeDetails.getTotalStudents() != null) {
                existingCollege.setTotalStudents(collegeDetails.getTotalStudents());
            }
            if (collegeDetails.getTotalAlumni() != null) {
                existingCollege.setTotalAlumni(collegeDetails.getTotalAlumni());
            }
            existingCollege.setUpdatedAt(LocalDateTime.now());
            return collegeRepository.save(existingCollege);
        }
        return null;
    }

    // Delete college
    public void deleteCollege(Long id) {
        collegeRepository.deleteById(id);
    }

}
