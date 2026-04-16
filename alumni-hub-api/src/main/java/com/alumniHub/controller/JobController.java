package com.alumniHub.controller;

import com.alumniHub.entity.Job;
import com.alumniHub.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    private JobService jobService;

    // Get all jobs
    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        List<Job> jobs = jobService.getAllJobs();
        return ResponseEntity.ok(jobs);
    }

    // Get open jobs
    @GetMapping("/open")
    public ResponseEntity<List<Job>> getOpenJobs() {
        List<Job> jobs = jobService.getOpenJobs();
        return ResponseEntity.ok(jobs);
    }

    // Get job by ID
    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        Optional<Job> job = jobService.getJobById(id);
        return job.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get jobs by alumni
    @GetMapping("/alumni/{alumniId}")
    public ResponseEntity<List<Job>> getJobsByAlumni(@PathVariable Long alumniId) {
        List<Job> jobs = jobService.getJobsByAlumni(alumniId);
        return ResponseEntity.ok(jobs);
    }

    // Get jobs by company
    @GetMapping("/company/{company}")
    public ResponseEntity<List<Job>> getJobsByCompany(@PathVariable String company) {
        List<Job> jobs = jobService.getJobsByCompany(company);
        return ResponseEntity.ok(jobs);
    }

    // Create new job
    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        Job newJob = jobService.createJob(job);
        return ResponseEntity.status(HttpStatus.CREATED).body(newJob);
    }

    // Update job
    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestBody Job jobDetails) {
        Job updatedJob = jobService.updateJob(id, jobDetails);
        if (updatedJob != null) {
            return ResponseEntity.ok(updatedJob);
        }
        return ResponseEntity.notFound().build();
    }

    // Close job
    @PutMapping("/{id}/close")
    public ResponseEntity<Job> closeJob(@PathVariable Long id) {
        Job closedJob = jobService.closeJob(id);
        if (closedJob != null) {
            return ResponseEntity.ok(closedJob);
        }
        return ResponseEntity.notFound().build();
    }

    // Delete job
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

}
