package com.alumniHub.service;

import com.alumniHub.entity.ConnectionRequest;
import com.alumniHub.repository.ConnectionRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ConnectionRequestService {

    @Autowired
    private ConnectionRequestRepository connectionRequestRepository;

    public List<ConnectionRequest> getAllConnectionRequests() {
        return connectionRequestRepository.findAll();
    }

    public Optional<ConnectionRequest> getConnectionRequestById(Long id) {
        return connectionRequestRepository.findById(id);
    }

    public List<ConnectionRequest> getConnectionRequestsByCollegeId(Long collegeId) {
        return connectionRequestRepository.findByCollegeId(collegeId);
    }

    public List<ConnectionRequest> getConnectionRequestsByStudentId(Long studentId) {
        return connectionRequestRepository.findByStudentId(studentId);
    }

    public List<ConnectionRequest> getConnectionRequestsByAlumniId(Long alumniId) {
        return connectionRequestRepository.findByAlumniId(alumniId);
    }

    public List<ConnectionRequest> getPendingConnectionRequestsByAlumniId(Long alumniId) {
        return connectionRequestRepository.findByAlumniIdAndStatus(alumniId, "PENDING");
    }

    public ConnectionRequest createConnectionRequest(ConnectionRequest request) {
        if (request.getStatus() == null || request.getStatus().trim().isEmpty()) {
            request.setStatus("PENDING");
        }
        if (request.getRequestDate() == null) {
            request.setRequestDate(LocalDateTime.now());
        }
        if (request.getAssignedDate() == null) {
            request.setAssignedDate(LocalDateTime.now());
        }

        return connectionRequestRepository.save(request);
    }

    public ConnectionRequest updateConnectionRequest(Long id, ConnectionRequest requestDetails) {
        Optional<ConnectionRequest> optionalRequest = connectionRequestRepository.findById(id);
        if (!optionalRequest.isPresent()) {
            return null;
        }

        ConnectionRequest existing = optionalRequest.get();

        if (requestDetails.getMessage() != null) {
            existing.setMessage(requestDetails.getMessage());
        }
        if (requestDetails.getStatus() != null) {
            existing.setStatus(requestDetails.getStatus());
            existing.setResponseDate(LocalDateTime.now());
        }
        if (requestDetails.getRequestType() != null) {
            existing.setRequestType(requestDetails.getRequestType());
        }
        if (requestDetails.getCollegeId() != null) {
            existing.setCollegeId(requestDetails.getCollegeId());
        }
        if (requestDetails.getStudentId() != null) {
            existing.setStudentId(requestDetails.getStudentId());
        }
        if (requestDetails.getAlumniId() != null) {
            existing.setAlumniId(requestDetails.getAlumniId());
        }
        if (requestDetails.getTopic() != null) {
            existing.setTopic(requestDetails.getTopic());
        }
        if (requestDetails.getSessionMode() != null) {
            existing.setSessionMode(requestDetails.getSessionMode());
        }
        if (requestDetails.getPreferredSessionDate() != null) {
            existing.setPreferredSessionDate(requestDetails.getPreferredSessionDate());
        }

        return connectionRequestRepository.save(existing);
    }

    public void deleteConnectionRequest(Long id) {
        connectionRequestRepository.deleteById(id);
    }

    public ConnectionRequest scheduleSession(Long id, ConnectionRequest scheduleDetails) {
        Optional<ConnectionRequest> optionalRequest = connectionRequestRepository.findById(id);
        if (!optionalRequest.isPresent()) {
            return null;
        }

        ConnectionRequest existing = optionalRequest.get();
        if (!"ACCEPTED".equalsIgnoreCase(existing.getStatus())) {
            return null;
        }

        if (scheduleDetails.getScheduledSessionDate() != null) {
            existing.setScheduledSessionDate(scheduleDetails.getScheduledSessionDate());
        }
        if (scheduleDetails.getMeetingRoomId() != null) {
            existing.setMeetingRoomId(scheduleDetails.getMeetingRoomId());
        }
        if (scheduleDetails.getMeetingProvider() != null) {
            existing.setMeetingProvider(scheduleDetails.getMeetingProvider());
        }

        return connectionRequestRepository.save(existing);
    }

    public ConnectionRequest generateSessionReport(Long id, ConnectionRequest reportDetails) {
        Optional<ConnectionRequest> optionalRequest = connectionRequestRepository.findById(id);
        if (!optionalRequest.isPresent()) {
            return null;
        }

        ConnectionRequest existing = optionalRequest.get();
        if (!"ACCEPTED".equalsIgnoreCase(existing.getStatus())) {
            return null;
        }

        if (reportDetails.getReportSummary() != null) {
            existing.setReportSummary(reportDetails.getReportSummary());
        }
        if (reportDetails.getReportForStudent() != null) {
            existing.setReportForStudent(reportDetails.getReportForStudent());
        }
        if (reportDetails.getSessionMark() != null) {
            existing.setSessionMark(reportDetails.getSessionMark());
        }

        existing.setReportVisibleToStudent(Boolean.TRUE);
        existing.setReportVisibleToCollege(Boolean.TRUE);
        existing.setReportGeneratedAt(LocalDateTime.now());

        return connectionRequestRepository.save(existing);
    }
}
