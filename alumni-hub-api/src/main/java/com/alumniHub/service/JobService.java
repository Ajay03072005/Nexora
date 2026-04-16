package com.alumniHub.service;

import com.alumniHub.entity.Job;
import com.alumniHub.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    // Get all jobs
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    // Get open jobs only
    public List<Job> getOpenJobs() {
        return jobRepository.findByIsClosedFalse();
    }

    // Get job by ID
    public Optional<Job> getJobById(Long id) {
        return jobRepository.findById(id);
    }

    // Get jobs posted by alumni
    public List<Job> getJobsByAlumni(Long alumniId) {
        return jobRepository.findByPostedByAlumni(alumniId);
    }

    // Get jobs by company
    public List<Job> getJobsByCompany(String company) {
        return jobRepository.findByCompany(company);
    }

    // Create new job
    public Job createJob(Job job) {
        job.setPostedDate(LocalDateTime.now());
        job.setIsClosed(false);
        return jobRepository.save(job);
    }

    // Update job
    public Job updateJob(Long id, Job jobDetails) {
        Optional<Job> job = jobRepository.findById(id);
        if (job.isPresent()) {
            Job existingJob = job.get();
            if (jobDetails.getTitle() != null) {
                existingJob.setTitle(jobDetails.getTitle());
            }
            if (jobDetails.getDescription() != null) {
                existingJob.setDescription(jobDetails.getDescription());
            }
            if (jobDetails.getSalary() != null) {
                existingJob.setSalary(jobDetails.getSalary());
            }
            if (jobDetails.getIsClosed() != null) {
                existingJob.setIsClosed(jobDetails.getIsClosed());
            }
            return jobRepository.save(existingJob);
        }
        return null;
    }

    // Close job
    public Job closeJob(Long id) {
        Optional<Job> job = jobRepository.findById(id);
        if (job.isPresent()) {
            Job existingJob = job.get();
            existingJob.setIsClosed(true);
            return jobRepository.save(existingJob);
        }
        return null;
    }

    // Delete job
    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }

}
