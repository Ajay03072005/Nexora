package com.alumniHub.controller;

import com.alumniHub.entity.ConnectionRequest;
import com.alumniHub.service.ConnectionRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/connection-requests")
@CrossOrigin(origins = "*")
public class ConnectionRequestController {

    @Autowired
    private ConnectionRequestService connectionRequestService;

    @GetMapping
    public ResponseEntity<List<ConnectionRequest>> getAllConnectionRequests() {
        return ResponseEntity.ok(connectionRequestService.getAllConnectionRequests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConnectionRequest> getConnectionRequestById(@PathVariable Long id) {
        Optional<ConnectionRequest> request = connectionRequestService.getConnectionRequestById(id);
        return request.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/college/{collegeId}")
    public ResponseEntity<List<ConnectionRequest>> getConnectionRequestsByCollegeId(@PathVariable Long collegeId) {
        return ResponseEntity.ok(connectionRequestService.getConnectionRequestsByCollegeId(collegeId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ConnectionRequest>> getConnectionRequestsByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(connectionRequestService.getConnectionRequestsByStudentId(studentId));
    }

    @GetMapping("/student/{studentId}/reports")
    public ResponseEntity<List<Map<String, Object>>> getStudentVisibleReports(@PathVariable Long studentId) {
        List<ConnectionRequest> requests = connectionRequestService.getConnectionRequestsByStudentId(studentId);
        List<Map<String, Object>> payload = new ArrayList<>();

        for (ConnectionRequest request : requests) {
            boolean isAccepted = "ACCEPTED".equalsIgnoreCase(request.getStatus());
            boolean visible = Boolean.TRUE.equals(request.getReportVisibleToStudent());
            if (!isAccepted || !visible) {
                continue;
            }

            Map<String, Object> item = new HashMap<>();
            item.put("id", request.getId());
            item.put("studentId", request.getStudentId());
            item.put("alumniId", request.getAlumniId());
            item.put("collegeId", request.getCollegeId());
            item.put("topic", request.getTopic());
            item.put("status", request.getStatus());
            item.put("sessionMode", request.getSessionMode());
            item.put("scheduledSessionDate", request.getScheduledSessionDate());
            item.put("meetingRoomId", request.getMeetingRoomId());
            item.put("meetingProvider", request.getMeetingProvider());
            item.put("reportSummary", request.getReportSummary());
            item.put("reportForStudent", request.getReportForStudent());
            item.put("reportGeneratedAt", request.getReportGeneratedAt());
            payload.add(item);
        }

        return ResponseEntity.ok(payload);
    }

    @GetMapping("/alumni/{alumniId}")
    public ResponseEntity<List<ConnectionRequest>> getConnectionRequestsByAlumniId(@PathVariable Long alumniId) {
        return ResponseEntity.ok(connectionRequestService.getConnectionRequestsByAlumniId(alumniId));
    }

    @GetMapping("/alumni/{alumniId}/pending")
    public ResponseEntity<List<ConnectionRequest>> getPendingConnectionRequestsByAlumniId(@PathVariable Long alumniId) {
        return ResponseEntity.ok(connectionRequestService.getPendingConnectionRequestsByAlumniId(alumniId));
    }

    @GetMapping("/college/{collegeId}/reports")
    public ResponseEntity<List<ConnectionRequest>> getCollegeVisibleReports(@PathVariable Long collegeId) {
        List<ConnectionRequest> requests = connectionRequestService.getConnectionRequestsByCollegeId(collegeId);
        List<ConnectionRequest> payload = new ArrayList<>();

        for (ConnectionRequest request : requests) {
            boolean isAccepted = "ACCEPTED".equalsIgnoreCase(request.getStatus());
            boolean visible = Boolean.TRUE.equals(request.getReportVisibleToCollege());
            if (isAccepted && visible) {
                payload.add(request);
            }
        }

        return ResponseEntity.ok(payload);
    }

    @PostMapping
    public ResponseEntity<ConnectionRequest> createConnectionRequest(@RequestBody ConnectionRequest request) {
        ConnectionRequest createdRequest = connectionRequestService.createConnectionRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRequest);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConnectionRequest> updateConnectionRequest(@PathVariable Long id, @RequestBody ConnectionRequest requestDetails) {
        ConnectionRequest updatedRequest = connectionRequestService.updateConnectionRequest(id, requestDetails);
        if (updatedRequest == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedRequest);
    }

    @PutMapping("/{id}/schedule")
    public ResponseEntity<ConnectionRequest> scheduleSession(@PathVariable Long id, @RequestBody ConnectionRequest scheduleDetails) {
        ConnectionRequest updatedRequest = connectionRequestService.scheduleSession(id, scheduleDetails);
        if (updatedRequest == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return ResponseEntity.ok(updatedRequest);
    }

    @PutMapping("/{id}/report")
    public ResponseEntity<ConnectionRequest> generateSessionReport(@PathVariable Long id, @RequestBody ConnectionRequest reportDetails) {
        ConnectionRequest updatedRequest = connectionRequestService.generateSessionReport(id, reportDetails);
        if (updatedRequest == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return ResponseEntity.ok(updatedRequest);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConnectionRequest(@PathVariable Long id) {
        connectionRequestService.deleteConnectionRequest(id);
        return ResponseEntity.noContent().build();
    }
}
