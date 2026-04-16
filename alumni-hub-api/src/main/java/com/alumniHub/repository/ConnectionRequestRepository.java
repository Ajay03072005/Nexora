package com.alumniHub.repository;

import com.alumniHub.entity.ConnectionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequest, Long> {
    List<ConnectionRequest> findByFromUserId(Long fromUserId);
    List<ConnectionRequest> findByToUserId(Long toUserId);
    List<ConnectionRequest> findByStatus(String status);
    List<ConnectionRequest> findByCollegeId(Long collegeId);
    List<ConnectionRequest> findByStudentId(Long studentId);
    List<ConnectionRequest> findByAlumniId(Long alumniId);
    List<ConnectionRequest> findByAlumniIdAndStatus(Long alumniId, String status);
}
