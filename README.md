# AlumniHub - Alumni Association Platform

A comprehensive role-based web platform for colleges to connect students with alumni for mentorship, career guidance, and professional development.

## 📋 Features

### 1. **Role-Based Access Control**
   - **Student Portal**: For current students seeking mentorship
   - **Alumni Portal**: For graduates offering mentorship
   - **College Admin Portal**: For administrators managing the program

### 2. **Authentication System**
   - Secure login with role-based routing
   - Demo accounts for testing
   - Session management with localStorage

### 3. **One-on-One Mentorship System**
   - College assigns students to alumni mentors
   - Students cannot self-register for sessions
   - College controls all session assignments
   - Feedback and grading system

### 4. **Feature Highlights**
   - Job board with opportunities
   - Alumni directory
   - Event management
   - Session feedback and performance tracking
   - Analytics dashboard for college admins

## 🚀 Getting Started

### Demo Accounts

1. **Student Login:**
   - Email: `student@college.edu`
   - Password: `password123`

2. **Alumni Login:**
   - Email: `alumni@college.edu`
   - Password: `password123`

3. **College Admin Login:**
   - Email: `college@admin.edu`
   - Password: `password123`

## 📁 File Structure

```
AlumniHub/
├── login.html                    # Login page with role selection
├── student-dashboard.html        # Student home page
├── alumni-dashboard.html         # Alumni home page
├── college-dashboard.html        # College admin dashboard
├── styles.css                    # All CSS styles
├── auth.js                       # Authentication logic
├── student-dashboard.js          # Student page logic
├── alumni-dashboard.js           # Alumni page logic
├── college-dashboard.js          # College page logic
├── script.js                     # Shared functionality
└── index.html                    # Original main page
```

## 🔐 How It Works

### Student Journey
1. Student logs in with credentials
2. Redirected to student dashboard
3. **Cannot** directly book sessions
4. Can only view sessions assigned by college
5. Submits feedback after sessions
6. Receives marks and feedback from alumni

### Alumni Journey
1. Alumni logs in with credentials
2. Sees pending session requests from college
3. **Accept/Decline** session requests from students
4. Conducts scheduled sessions
5. Provides marks and detailed feedback
6. Views their mentorship impact

### College Admin Journey
1. College admin logs in with credentials
2. Views all students and alumni
3. **Assigns students to alumni** for mentorship
4. Specifies session topics and count
5. Tracks session completion
6. Views analytics and placement rates

## 🎯 Key Workflow

```
College Admin → Selects Student → Selects Alumni Mentor → Creates Assignment
                                                           ↓
Student Receives Notification       Alumni Receives Request
        ↓                                    ↓
   Prepares for Session         Accepts/Declines Request
        ↓                                    ↓
   Attends Session              Conducts Mentoring
        ↓                                    ↓
Submits Feedback              Provides Grades & Feedback
        ↓                                    ↓
Gets Performance Score        Views Student Progress
```

## 🎨 UI Components

### Login Page
- Role selection tabs (Student, Alumni, College)
- Email and password input
- Demo credentials display
- Signup option

### Student Dashboard
- Quick stats (sessions, ratings, applications)
- Assigned sessions view
- Job opportunities
- Upcoming events
- Alumni success stories

### Alumni Dashboard
- Quick stats (requests, scheduled sessions, students mentored)
- Pending session requests with student details
- Upcoming sessions schedule
- Impact analytics

### College Admin Dashboard
- Quick stats (active students, alumni, completed sessions)
- Session assignment interface
- Current assignments tracking
- Recent activity feed
- Program performance metrics

## 💾 Data Storage

Currently uses **localStorage** for demo purposes. In production, integrate with:
- Backend REST API
- Database (PostgreSQL, MongoDB, etc.)
- Authentication service

## 🔧 Customization

### Change Session Fee
Edit in `alumni-dashboard.html`:
```javascript
const mentorFees = {
    'Dr. Rajesh Kumar': '₹500',
    'Sarah Johnson': '₹400',
    'Karan Malhotra': '₹300'
};
```

### Add More Demo Users
Edit in `auth.js`:
```javascript
const demoUsers = {
    'newuser@college.edu': {
        password: 'password123',
        role: 'student', // or 'alumni' or 'college'
        name: 'User Name',
        batch: 2024
    }
};
```

### Customize Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1890ff;
    --accent-color: #f97316;
    /* ... */
}
```

## 📱 Responsive Design

The platform is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (below 768px)

## 🔒 Security Notes

**For Production:**
- Replace localStorage with secure session management
- Use encrypted passwords
- Implement HTTPS
- Add CSRF protection
- Validate all inputs
- Implement rate limiting

## 📊 Analytics Tracked

- Students mentored
- Sessions completed
- Performance ratings
- Placement rates
- Student satisfaction
- Alumni engagement

## 🎓 Educational Value

This platform helps:
- Students get personalized career guidance
- Alumni build their professional network
- Colleges track placement success
- Track student development progression

## 🚀 Future Enhancements

- Video conferencing integration
- Email notifications
- Certificate generation
- Mobile app version
- Advanced analytics dashboard
- Payment gateway integration
- Batch scheduling
- Recommendation engine

## 📞 Support

For issues or questions, please refer to the documentation or contact the development team.

---

**Version**: 1.0  
**Last Updated**: April 2026  
**License**: MIT
