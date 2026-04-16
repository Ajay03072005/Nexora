# AlumniHub API - Spring Boot Backend

A complete Spring Boot backend for the AlumniHub alumni placement platform.

## Location
```
NEXORA/alumni-hub-api/
```

## 🚀 Quick Start (3 Steps)

### 1. Setup Database
```bash
mysql -u root -p < src/main/resources/database/schema.sql
```

### 2. Configure Connection
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 3. Run
```bash
mvn clean install
mvn spring-boot:run
```

**API runs on:** `http://localhost:8080/api`

---

## 📦 Project Contents

### Entity Classes (8 files)
- User, Student, Alumni, College, Job, JobRequest, Event, ConnectionRequest

### Repositories (8 files)
- Spring Data JPA for database access

### Services (5 files)
- StudentService, AlumniService, JobService, EventService, CollegeService

### Controllers (5 files)
- REST API endpoints (50+ endpoints total)

### Database
- `schema.sql` - Complete database structure
- `sample_data.sql` - Test data

---

## 🔌 API Endpoints Summary

### Students (`/api/students`)
- `GET` - All students
- `GET /{id}` - By ID
- `GET /email/{email}` - By email
- `POST` - Create
- `PUT /{id}` - Update
- `DELETE /{id}` - Delete

### Alumni (`/api/alumni`)
- `GET` - All alumni
- `GET /{id}` - By ID
- `GET /email/{email}` - By email
- `GET /year/{year}` - By graduation year
- `GET /mentors/available` - Available mentors
- `GET /hiring/available` - Available for hiring
- `POST` - Create
- `PUT /{id}` - Update
- `DELETE /{id}` - Delete

### Jobs (`/api/jobs`)
- `GET` - All jobs
- `GET /open` - Open jobs only
- `GET /{id}` - By ID
- `GET /alumni/{alumniId}` - By alumni
- `GET /company/{company}` - By company
- `POST` - Create
- `PUT /{id}` - Update
- `PUT /{id}/close` - Close job
- `DELETE /{id}` - Delete

### Events (`/api/events`)
- `GET` - All events
- `GET /{id}` - By ID
- `GET /organizer/{alumniId}` - By organizer
- `GET /type/{eventType}` - By type
- `POST` - Create
- `PUT /{id}` - Update
- `DELETE /{id}` - Delete

### Colleges (`/api/colleges`)
- `GET` - All colleges
- `GET /{id}` - By ID
- `GET /email/{email}` - By email
- `POST` - Create
- `PUT /{id}` - Update
- `DELETE /{id}` - Delete

---

## 🗄️ Database Tables

1. **users** - User accounts
2. **students** - Student information
3. **alumni** - Alumni profiles
4. **colleges** - Institution information
5. **jobs** - Job postings
6. **job_requests** - Job applications
7. **events** - Events/Workshops
8. **connection_requests** - Network connections

---

## 🛠️ Technology Stack

- Spring Boot 2.7.14
- Spring Data JPA
- MySQL 8.0
- Lombok
- Maven
- Java 11+

---

## 📝 Example Usage

### Create a Student
```bash
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "enrollmentNumber": "STU005",
    "name": "Alice Brown",
    "email": "alice@student.com",
    "department": "IT",
    "semester": "3rd"
  }'
```

### Get All Alumni
```bash
curl http://localhost:8080/api/alumni
```

### Create a Job
```bash
curl -X POST http://localhost:8080/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Java Developer",
    "company": "Google",
    "location": "Bangalore",
    "jobType": "FULL_TIME",
    "salary": "12-15 LPA",
    "postedByAlumni": 1
  }'
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection refused | Check MySQL is running and credentials in application.properties |
| Port 8080 in use | Change `server.port=8081` in application.properties |
| Build fails | Run `mvn clean install` |
| Database not found | Run schema.sql first |

---

## 📚 Next Steps

1. ✅ Backend running
2. Connect frontend (`../assets/js/api-service.js`)
3. Load sample data
4. Test endpoints with Postman
5. Deploy to cloud

---

**Backend is ready! 🚀**
