# 🔐 Login & Signup Guide - NEXORA Alumni Hub

## ✅ System Status

| Component | Status |
|-----------|--------|
| **Backend API** | ✅ Running on port 8081 |
| **Auth Endpoints** | ✅ Active |
| **Database** | ✅ Connected with test users |
| **Frontend Form** | ✅ Ready |

---

## 🚀 Quick Start (3 Steps)

### **Step 1: Open Login Page**
Navigate to: `c:\Users\ajaya\Documents\NEXORA\login.html`
OR Click the ["Login" button on homepage](c:\Users\ajaya\Documents\NEXORA\index.html)

### **Step 2: Select Your Role**
Choose one of three roles:
- 👨‍🎓 **Student**
- 👔 **Alumni**  
- 🏫 **College Admin**

### **Step 3: Enter Credentials**

Use one of these **demo accounts**:

| Role | Email | Password |
|------|-------|----------|
| **Student** | `student@college.edu` | `password123` |
| **Alumni** | `alumni@college.edu` | `password123` |
| **College** | `college@admin.edu` | `password123` |

Click **"Login"** → ✅ You're in!

---

## 📝 Create New Account (SignUp)

### **Method 1: From Login Page**
1. Go to login page
2. Click **"Don't have an account? Sign Up"** link
3. A signup form will appear
4. Fill in:
   - Role (Student/Alumni/College)
   - Full Name
   - Email
   - Password
   - Confirm Password
5. Click **"Create Account"**
6. ✅ You're registered and logged in!

### **Method 2: Demo Signup**
```javascript
// Test signup in browser console:
fetch('http://localhost:8081/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'testpass123',
    role: 'student'
  })
})
.then(r => r.json())
.then(data => console.log('New account created:', data))
```

---

## 🔐 API Endpoints

### **Login**
```
POST /api/auth/login

Request:
{
  "email": "student@college.edu",
  "password": "password123"
}

Response (Success):
{
  "id": 1,
  "name": "Priya Sharma",
  "email": "student@college.edu",
  "role": "student"
}
```

### **Sign Up**
```
POST /api/auth/signup

Request:
{
  "name": "New User",
  "email": "newuser@college.edu",
  "password": "password123",
  "role": "student"
}

Response (Success):
{
  "id": 4,
  "name": "New User",
  "email": "newuser@college.edu",
  "role": "student"
}
```

### **Validate Session**
```
GET /api/auth/validate/{userId}

Example: /api/auth/validate/1

Response:
{
  "id": 1,
  "name": "Priya Sharma",
  "email": "student@college.edu",
  "role": "student"
}
```

---

## 🎯 What Happens After Login

1. **User data saved** → Stored in browser's localStorage
2. **Auto redirect** → Taken to your role's dashboard
   - Student → Student Dashboard
   - Alumni → Alumni Dashboard
   - College → College Dashboard
3. **API integration** → Access all features with real data

---

## ✨ Feature Breakdown by Role

### **Student Dashboard Access**
- ✅ View available mentors from alumni
- ✅ Browse job opportunities
- ✅ Register for events/webinars
- ✅ Schedule mentoring sessions
- ✅ Network with alumni

### **Alumni Dashboard Access**
- ✅ Update profile (company, designation)
- ✅ Post job opportunities
- ✅ Offer mentorship
- ✅ Connect with other alumni
- ✅ View mentorship requests

### **College Admin Dashboard Access**
- ✅ Manage student records
- ✅ View alumni statistics
- ✅ Create events and webinars
- ✅ Monitor platform analytics
- ✅ Manage all users

---

## 🧪 Test the System

### **Test 1: Login as Student**
```
1. Select "Student" role
2. Email: student@college.edu
3. Password: password123
4. Click Login
5. Should see Student Dashboard
```

### **Test 2: SignUp New Account**
```
1. Click "Sign Up" link
2. Select "Alumni" role
3. Enter: John Doe / john@example.com / password123
4. Click "Create Account"
5. Should see Alumni Dashboard
```

### **Test 3: Check Browser Storage**
```javascript
// Open browser console (F12) and run:
JSON.parse(localStorage.getItem('currentUser'))

// Expected output:
{
  "id": 1,
  "name": "Priya Sharma",
  "email": "student@college.edu",
  "role": "student"
}
```

---

## 🔧 How It Works Behind the Scenes

### **Flow Diagram**
```
User enters credentials
        ↓
Frontend Form (login.html)
        ↓
login-signup.js submits
        ↓
Backend API (http://localhost:8081/api/auth/login)
        ↓
AuthController validates credentials
        ↓
UserService checks database
        ↓
MySQL returns user data or error
        ↓
Frontend saves to localStorage
        ↓
Auto-redirect to dashboard
```

### **Database **
```
users table (MySQL)
├── id (auto-increment)
├── email (unique constraint)
├── password (plain text in demo, should be encrypted in production)
├── name
├── role (student/alumni/college)
├── bio
├── profile_picture
├── is_active (true/false)
├── created_at (timestamp)
└── updated_at (timestamp)

Pre-loaded test users:
- student@college.edu (Priya Sharma)
- alumni@college.edu (Dr. Rajesh Kumar)
- college@admin.edu (College Administrator)
```

---

## ⚠️ Troubleshooting

### **"Invalid email or password" Error**
✓ Check email spelling (case-sensitive)  
✓ Check password (case-sensitive)  
✓ Make sure you selected the correct role  
✓ Use demo accounts to test

### **"Email already exists" Error**
✓ That email is already registered  
✓ Use a different email  
✓ Or login with existing email

### **Can't see login page**
✓ Make sure backend is running on port 8081  
✓ Check if MySQL is running  
✓ Verify `login.html` exists in NEXORA folder

### **API not responding**
✓ Check backend terminal for errors  
✓ Verify MySQL is connected (check terminal for "HikariPool-1")  
✓ Check browser console (F12) for network errors

### **Login works but can't access dashboard**
✓ Make sure dashboard.html files exist in student/, alumni/, college/ folders  
✓ Check browser console for JavaScript errors  
✓ Verify api-service.js is loaded

---

## 🎯 Next Features (Optional Enhancements)

- [ ] Email verification for signup
- [ ] Forgot password functionality
- [ ] Two-factor authentication
- [ ] OAuth/Social login (Google, GitHub)
- [ ] Password encryption (bcrypt)
- [ ] JWT token-based authentication
- [ ] User profile pictures upload
- [ ] Email notifications

---

## 📊 Test Accounts Credentials

### Primary Test Accounts (Pre-loaded in Database)

```
╔═══════════════╦══════════════════════╦═════════════════╗
║ Role          ║ Email                ║ Password        ║
╠═══════════════╬══════════════════════╬═════════════════╣
║ Student       ║ student@college.edu  ║ password123     ║
║ Alumni        ║ alumni@college.edu   ║ password123     ║
║ College Admin ║ college@admin.edu    ║ password123     ║
╚═══════════════╩══════════════════════╩═════════════════╝
```

---

## 💡 Pro Tips

1. **Auto-fill from demo info:** Demo accounts are shown on login page for quick testing
2. **Stay logged in:** Refresh page - app remembers you via localStorage
3. **Check API directly:** 
   ```
   curl http://localhost:8081/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"student@college.edu","password":"password123"}'
   ```
4. **Debug with F12:** Open browser console to see API requests/responses

---

## ✅ Checklist for Using Login/Signup

- [ ] Backend is running (`mvn spring-boot:run`)
- [ ] MySQL is running and `alumni_hub_db` exists
- [ ] Test users are in database (already loaded)
- [ ] Frontend files are in `c:\Users\ajaya\Documents\NEXORA\`
- [ ] `login.html` is accessible
- [ ] Try login with demo account
- [ ] Try signup with new account
- [ ] Verify localStorage saves user info
- [ ] Can access dashboard after login
- [ ] Can logout and login again

---

**Status:** ✅ Login/Signup System is READY!  
**Backend:** Running on port 8081  
**Database:** Connected with test users  
**Frontend:** Forms created and integrated

Start using the system now! 🚀
