package com.alumniHub.repository;

import com.alumniHub.entity.JobRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRequestRepository extends JpaRepository<JobRequest, Long> {
    List<JobRequest> findByJobId(Long jobId);
    List<JobRequest> findByStudentId(Long studentId);
    List<JobRequest> findByStatus(String status);
}
