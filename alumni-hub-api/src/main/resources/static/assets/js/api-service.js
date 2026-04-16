/**
 * Alumni Hub API Service
 * Provides centralized API calls to the Spring Boot backend
 * Base URL: http://localhost:8081/api
 */

const API_BASE_URL = 'http://localhost:8081/api';

// ===========================
// STUDENT API SERVICE
// ===========================
class StudentService {
  static async getAllStudents() {
    try {
      const response = await fetch(`${API_BASE_URL}/students`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  static async getStudentById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error);
      throw error;
    }
  }

  static async getStudentByEmail(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/email/${email}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching student by email ${email}:`, error);
      throw error;
    }
  }

  static async createStudent(studentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  static async updateStudent(id, studentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error updating student ${id}:`, error);
      throw error;
    }
  }

  static async deleteStudent(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return true;
    } catch (error) {
      console.error(`Error deleting student ${id}:`, error);
      throw error;
    }
  }
}

// ===========================
// ALUMNI API SERVICE
// ===========================
class AlumniService {
  static async getAllAlumni() {
    try {
      const response = await fetch(`${API_BASE_URL}/alumni`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching alumni:', error);
      throw error;
    }
  }

  static async getAlumniById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/alumni/${id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching alumni ${id}:`, error);
      throw error;
    }
  }

  static async getAvailableMentors() {
    try {
      const response = await fetch(`${API_BASE_URL}/alumni/mentors/available`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching available mentors:', error);
      throw error;
    }
  }

  static async getHiringAlumni() {
    try {
      const response = await fetch(`${API_BASE_URL}/alumni/hiring/available`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching hiring alumni:', error);
      throw error;
    }
  }

  static async createAlumni(alumniData) {
    try {
      const response = await fetch(`${API_BASE_URL}/alumni`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alumniData),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error creating alumni:', error);
      throw error;
    }
  }

  static async updateAlumni(id, alumniData) {
    try {
      const response = await fetch(`${API_BASE_URL}/alumni/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alumniData),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error updating alumni ${id}:`, error);
      throw error;
    }
  }

  static async deleteAlumni(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/alumni/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return true;
    } catch (error) {
      console.error(`Error deleting alumni ${id}:`, error);
      throw error;
    }
  }
}

// ===========================
// JOB API SERVICE
// ===========================
class JobService {
  static async getAllJobs() {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  }

  static async getJobById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching job ${id}:`, error);
      throw error;
    }
  }

  static async getOpenJobs() {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/open`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching open jobs:', error);
      throw error;
    }
  }

  static async getJobsByCompany(company) {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/company/${company}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching jobs for company ${company}:`, error);
      throw error;
    }
  }

  static async createJob(jobData) {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }

  static async updateJob(id, jobData) {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error updating job ${id}:`, error);
      throw error;
    }
  }

  static async closeJob(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${id}/close`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error closing job ${id}:`, error);
      throw error;
    }
  }

  static async deleteJob(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return true;
    } catch (error) {
      console.error(`Error deleting job ${id}:`, error);
      throw error;
    }
  }
}

// ===========================
// EVENT API SERVICE
// ===========================
class EventService {
  static async getAllEvents() {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  static async getEventById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      throw error;
    }
  }

  static async getEventsByType(type) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/type/${type}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching events by type ${type}:`, error);
      throw error;
    }
  }

  static async getUpcomingEvents() {
    try {
      console.log('🔍 Fetching upcoming events from /events...');
      // Use /events instead of /events/upcoming (endpoint doesn't exist)
      const response = await fetch(`${API_BASE_URL}/events`);
      console.log('📨 Events Response Status:', response.status);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const events = await response.json();
      console.log('✅ Fetched events:', events.length, 'events');
      
      // Filter for future events (optional)
      const now = new Date();
      return events.filter(event => new Date(event.eventDate) >= now).slice(0, 10);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }
  }

  static async createEvent(eventData) {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  static async updateEvent(id, eventData) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error updating event ${id}:`, error);
      throw error;
    }
  }

  static async deleteEvent(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return true;
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error);
      throw error;
    }
  }
}

// ===========================
// COLLEGE API SERVICE
// ===========================
class CollegeService {
  static async getAllColleges() {
    try {
      const response = await fetch(`${API_BASE_URL}/colleges`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching colleges:', error);
      throw error;
    }
  }

  static async getCollegeById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/colleges/${id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching college ${id}:`, error);
      throw error;
    }
  }

  static async createCollege(collegeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/colleges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collegeData),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error creating college:', error);
      throw error;
    }
  }

  static async updateCollege(id, collegeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/colleges/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collegeData),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error updating college ${id}:`, error);
      throw error;
    }
  }

  static async deleteCollege(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/colleges/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return true;
    } catch (error) {
      console.error(`Error deleting college ${id}:`, error);
      throw error;
    }
  }
}

// ===========================
// JOB REQUEST API SERVICE
// ===========================
class JobRequestService {
  static async getAllJobRequests() {
    try {
      const response = await fetch(`${API_BASE_URL}/job-requests`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching job requests:', error);
      throw error;
    }
  }

  static async getJobRequestById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/job-requests/${id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching job request ${id}:`, error);
      throw error;
    }
  }

  static async createJobRequest(requestData) {
    try {
      const response = await fetch(`${API_BASE_URL}/job-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error creating job request:', error);
      throw error;
    }
  }

  static async updateJobRequest(id, requestData) {
    try {
      const response = await fetch(`${API_BASE_URL}/job-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error updating job request ${id}:`, error);
      throw error;
    }
  }

  static async deleteJobRequest(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/job-requests/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return true;
    } catch (error) {
      console.error(`Error deleting job request ${id}:`, error);
      throw error;
    }
  }
}

// ===========================
// CONNECTION REQUEST API SERVICE
// ===========================
class ConnectionRequestService {
  static async getAllConnectionRequests() {
    try {
      const response = await fetch(`${API_BASE_URL}/connection-requests`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching connection requests:', error);
      throw error;
    }
  }

  static async getConnectionRequestById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/connection-requests/${id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching connection request ${id}:`, error);
      throw error;
    }
  }

  static async createConnectionRequest(requestData) {
    try {
      const response = await fetch(`${API_BASE_URL}/connection-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error creating connection request:', error);
      throw error;
    }
  }

  static async updateConnectionRequest(id, requestData) {
    try {
      const response = await fetch(`${API_BASE_URL}/connection-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error updating connection request ${id}:`, error);
      throw error;
    }
  }

  static async deleteConnectionRequest(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/connection-requests/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return true;
    } catch (error) {
      console.error(`Error deleting connection request ${id}:`, error);
      throw error;
    }
  }
}
