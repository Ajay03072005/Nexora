package com.alumniHub.repository;

import com.alumniHub.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByPostedByAlumni(Long alumniId);
    List<Job> findByIsClosedFalse();
    List<Job> findByCompany(String company);
}
