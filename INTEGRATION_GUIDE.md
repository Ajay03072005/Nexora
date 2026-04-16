# Frontend-Backend Integration Guide

## 🎯 Quick Start

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         NEXORA Alumni Hub                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Frontend (HTML/CSS/JS)                Backend (Spring Boot)   │
│  ┌──────────────────────────┐         ┌───────────────────┐   │
│  │  18 HTML Pages           │  HTTP   │  5 Controllers    │   │
│  │  - Student (5)     ─────────────>  │  - StudentAPI     │   │
│  │  - Alumni (5)      <─────────────  │  - AlumniAPI      │   │
│  │  - College (5)     JSON/REST       │  - JobAPI         │   │
│  │  - Public (3)              │       │  - EventAPI       │   │
│  │                            │       │  - CollegeAPI     │   │
│  │  API Service Layer         │       │                   │   │
│  │  ┌─────────────────────┐  │       │  8 Repositories   │   │
│  │  │ StudentService      │  │       │  5 Services       │   │
│  │  │ AlumniService       │  │       └───────────────────┘   │
│  │  │ JobService          │  │                   │            │
│  │  │ EventService        │  │                   ▼            │
│  │  │ CollegeService      │  │       ┌───────────────────┐   │
│  │  │ + 2 More Services   │  │       │  MySQL Database   │   │
│  │  └─────────────────────┘  │       │  alumni_hub_db    │   │
│  │                            │       │  (8 tables)       │   │
│  └──────────────────────────┘       └───────────────────┘   │
│                                       http://localhost:8081   │
│                API Base URL: http://localhost:8081/api        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Integration Files

### 1. **API Service Layer** 
**File:** `assets/js/api-service.js`  
**Size:** 500+ lines  
**Contains:** 7 service classes with full CRUD operations

### 2. **Authentication**
**File:** `assets/js/auth.js`  
**Provides:** User state management, login/logout handling

### 3. **Dashboard Controllers**
- `assets/js/student-dashboard.js` - Student data loading
- `assets/js/alumni-dashboard.js` - Alumni data loading
- `assets/js/college-dashboard.js` - College data loading (create similar to alumni)

---

## 🚀 How to Use

### **Step 1:** Import API Service in Your HTML Page

Add this script tag in the `<head>` or before other JS files:

```html
<script src="../assets/js/api-service.js"></script>
<script src="../assets/js/auth.js"></script>
<script src="../assets/js/your-dashboard.js"></script>
```

### **Step 2:** Use API Services in Your JavaScript

```javascript
// Example 1: Fetch all students
async function loadStudents() {
  try {
    const students = await StudentService.getAllStudents();
    console.log('Students:', students);
    // Update your HTML with this data
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 2: Get alumni with mentoring availability
async function getMentors() {
  try {
    const mentors = await AlumniService.getAvailableMentors();
    console.log('Available Mentors:', mentors);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 3: Get all open jobs
async function getJobs() {
  try {
    const jobs = await JobService.getOpenJobs();
    console.log('Open Jobs:', jobs);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 4: Create a new job (Alumni/College)
async function postJob(jobData) {
  try {
    const newJob = await JobService.createJob({
      title: "Senior Developer",
      company: "TechCorp",
      location: "Bangalore",
      description: "Build scalable systems",
      salary: "₹25-35 LPA",
      experienceRequired: "5+ years"
    });
    console.log('Job Created:', newJob);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### **Step 3:** Update HTML Elements with Data

```javascript
// Example: Display students in table
async function displayStudents() {
  const students = await StudentService.getAllStudents();
  const table = document.querySelector('#students-table tbody');
  
  students.forEach(student => {
    const row = `
      <tr>
        <td>${student.name}</td>
        <td>${student.email}</td>
        <td>${student.department}</td>
        <td>${student.semester}</td>
      </tr>
    `;
    table.innerHTML += row;
  });
}

// Call on page load
document.addEventListener('DOMContentLoaded', displayStudents);
```

---

## 📚 Available Services

### **StudentService**
```javascript
StudentService.getAllStudents()            // Get all students
StudentService.getStudentById(id)          // Get specific student
StudentService.createStudent(data)         // Create new (POST)
StudentService.updateStudent(id, data)     // Update existing (PUT)
StudentService.deleteStudent(id)           // Delete (DELETE)
```

### **AlumniService**
```javascript
AlumniService.getAllAlumni()               // Get all alumni
AlumniService.getAlumniById(id)            // Get specific alumni
AlumniService.getAvailableMentors()        // Get mentoring-available alumni
AlumniService.getHiringAlumni()            // Get alumni hiring
AlumniService.createAlumni(data)           // Create new alumni
AlumniService.updateAlumni(id, data)       // Update alumni
AlumniService.deleteAlumni(id)             // Delete alumni
```

### **JobService**
```javascript
JobService.getAllJobs()                    // Get all jobs
JobService.getJobById(id)                  // Get specific job
JobService.getOpenJobs()                   // Get only open jobs
JobService.getJobsByCompany(company)       // Filter by company
JobService.createJob(data)                 // Post new job
JobService.updateJob(id, data)             // Update job
JobService.closeJob(id)                    // Mark job closed
JobService.deleteJob(id)                   // Delete job
```

### **EventService**
```javascript
EventService.getAllEvents()                // Get all events
EventService.getEventById(id)              // Get specific event
EventService.getEventsByType(type)         // Filter by type (webinar, workshop, etc)
EventService.getUpcomingEvents()           // Get upcoming only
EventService.createEvent(data)             // Create event
EventService.updateEvent(id, data)         // Update event
EventService.deleteEvent(id)               // Delete event
```

### **CollegeService**
```javascript
CollegeService.getAllColleges()            // Get all colleges
CollegeService.getCollegeById(id)          // Get specific college
CollegeService.createCollege(data)         // Create college
CollegeService.updateCollege(id, data)     // Update college
CollegeService.deleteCollege(id)           // Delete college
```

### **JobRequestService**
```javascript
JobRequestService.getAllJobRequests()      // Get all applications
JobRequestService.getJobRequestById(id)    // Get specific application
JobRequestService.createJobRequest(data)   // Submit application
JobRequestService.updateJobRequest(id, data) // Update status
JobRequestService.deleteJobRequest(id)     // Cancel application
```

### **ConnectionRequestService**
```javascript
ConnectionRequestService.getAllConnectionRequests()     // Get requests
ConnectionRequestService.getConnectionRequestById(id)   // Get specific
ConnectionRequestService.createConnectionRequest(data)  // Send request
ConnectionRequestService.updateConnectionRequest(id, data) // Accept/Reject
ConnectionRequestService.deleteConnectionRequest(id)    // Delete
```

---

## 💾 Data Models

### **Student Object**
```javascript
{
  id: 1,
  enrollmentNumber: "ENR001",
  name: "Priya Sharma",
  email: "priya@example.com",
  department: "Computer Science",
  semester: "6",
  courseName: "B.Tech",
  bio: "...",
  profilePicture: "url...",
  createdAt: "2026-04-15T...",
  updatedAt: "2026-04-15T..."
}
```

### **Alumni Object**
```javascript
{
  id: 2,
  name: "Dr. Rajesh Kumar",
  email: "rajesh@example.com",
  department: "Computer Science",
  graduationYear: "2010",
  currentCompany: "Google",
  currentDesignation: "Senior Engineer",
  industry: "Technology",
  bio: "...",
  profilePicture: "url...",
  isAvailableForMentoring: true,
  isAvailableForHiring: false,
  createdAt: "2026-04-15T...",
  updatedAt: "2026-04-15T..."
}
```

### **Job Object**
```javascript
{
  id: 3,
  title: "Senior Software Engineer",
  company: "TechCorp",
  location: "Bangalore",
  description: "Build scalable systems",
  salary: "₹18-25 LPA",
  experienceRequired: "3-5 years",
  isOpen: true,
  createdAt: "2026-04-15T...",
  updatedAt: "2026-04-15T..."
}
```

### **Event Object**
```javascript
{
  id: 4,
  eventName: "AI Career Webinar",
  description: "Learn about AI opportunities",
  eventDate: "2026-04-22T18:00:00",
  location: "Zoom",
  eventType: "WEBINAR",
  capacity: 100,
  attendeeCount: 45,
  createdAt: "2026-04-15T...",
  updatedAt: "2026-04-15T..."
}
```

---

## ⚠️ Error Handling

All API calls include try-catch blocks. Errors will log to console and show user notifications:

```javascript
try {
  const data = await StudentService.getAllStudents();
  // Process data
} catch (error) {
  console.error('Error:', error);
  // Show error message to user
  showNotification('Failed to load students', 'error');
}
```

---

## 🔑 Required Setup

### Backend
- ✅ Spring Boot running on `http://localhost:8081`
- ✅ MySQL database: `alumni_hub_db`
- ✅ Database credentials: root / Ajay

### Verify Backend is Running
```javascript
// Open browser console and run:
StudentService.getAllStudents().then(data => {
  console.log('Backend is online!');
  console.log('Students count:', data.length);
});
```

---

## 📝 Example: Complete Alumni Dashboard Integration

```html
<!-- alumni/dashboard.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Alumni Dashboard</title>
    <link rel="stylesheet" href="../assets/css/main.css">
    <link rel="stylesheet" href="../assets/css/alumni.css">
</head>
<body>
    <!-- Your HTML content here -->
    
    <div id="mentors-container"></div>
    <div id="jobs-container"></div>
    <div id="events-container"></div>
    
    <!-- Scripts -->
    <script src="../assets/js/api-service.js"></script>
    <script src="../assets/js/auth.js"></script>
    <script>
        // Load mentors for display
        async function loadMentors() {
            try {
                const mentors = await AlumniService.getAvailableMentors();
                const container = document.getElementById('mentors-container');
                
                mentors.forEach(mentor => {
                    const card = `
                        <div class="mentor-card">
                            <h3>${mentor.name}</h3>
                            <p>${mentor.currentDesignation} at ${mentor.currentCompany}</p>
                            <button onclick="requestMentorship(${mentor.id})">
                                Request Mentorship
                            </button>
                        </div>
                    `;
                    container.innerHTML += card;
                });
            } catch (error) {
                console.error('Error loading mentors:', error);
            }
        }
        
        async function requestMentorship(alumniId) {
            try {
                const currentUser = AuthService.getCurrentUser();
                const response = await ConnectionRequestService.createConnectionRequest({
                    fromId: currentUser.id,
                    toId: alumniId,
                    type: 'MENTORSHIP'
                });
                alert('Mentorship request sent! ✨');
            } catch (error) {
                alert('Error sending request');
            }
        }
        
        // Load on page startup
        document.addEventListener('DOMContentLoaded', loadMentors);
    </script>
</body>
</html>
```

---

## 📞 Support & Debugging

### Check Backend Status
```bash
# Terminal command
curl http://localhost:8081/api/students
```

### Browser Console Tests
```javascript
// Test if API service is loaded
console.log(StudentService);  // Should show the class

// Test API connectivity
StudentService.getAllStudents()
  .then(data => console.log('✅ API Working!', data))
  .catch(error => console.log('❌ API Error!', error));
```

---

## ✅ Checklist for Full Integration

- [ ] Backend running on port 8081
- [ ] Database connected (alumni_hub_db)
- [ ] api-service.js imported in all pages
- [ ] auth.js imported for authentication
- [ ] Update all 18 pages to use API services
- [ ] Replace mock data with real API calls
- [ ] Add loading indicators for async operations
- [ ] Add error handling/notifications
- [ ] Test each endpoint from browser console
- [ ] (Optional) Implement authentication/login

---

**Last Updated:** April 15, 2026  
**Backend API:** http://localhost:8081/api  
**Status:** ✅ Ready for Integration
