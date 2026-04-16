/**
 * Login and Signup Functionality
 * Handles user authentication with backend API
 */

// Demo Accounts for Testing
const DEMO_ACCOUNTS = {
  'student': {
    email: 'student@demo.com',
    password: 'password123',
    name: 'Demo Student'
  },
  'alumni': {
    email: 'alumni@demo.com',
    password: 'password123',
    name: 'Demo Alumni'
  },
  'college': {
    email: 'college@demo.com',
    password: 'password123',
    name: 'Demo College Admin'
  }
};

// Get elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.querySelector('.signup-form');
const roleTabsButtons = document.querySelectorAll('.role-tab');
const signupLink = document.querySelector('.signup-link');
const signupModal = document.getElementById('signupModal');
const closeBtn = document.querySelector('.close');
const signupRoleSelect = document.getElementById('signupRole');

let selectedRole = 'student'; // Default role

/**
 * Handle role selection
 */
roleTabsButtons.forEach(button => {
  button.addEventListener('click', function() {
    // Remove active class from all
    roleTabsButtons.forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked
    this.classList.add('active');
    selectedRole = this.getAttribute('data-role');
    console.log('Selected role:', selectedRole);
  });
});

/**
 * Handle Login Form Submission
 */
loginForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  
  // Validate required fields
  if (!email || !password) {
    showNotification('Please enter email and password', 'error');
    return;
  }

  // Validate email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showNotification('Please enter a valid email address', 'error');
    return;
  }
  
  console.log('Attempting login:', { email, role: selectedRole });
  
  try {
    // Make API call to backend
    const response = await fetch('http://localhost:8081/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();

    if (response.ok && data.id) {
      // Success! Save user info
      const user = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role
      };

      localStorage.setItem('currentUser', JSON.stringify(user));
      console.log('✅ Login successful!', user);

      // Show success message
      showNotification('Login successful! 🎉', 'success');

      // Redirect based on role
      setTimeout(() => {
        redirectToDashboard(data.role);
      }, 1000);

    } else {
      // Error response
      console.error('❌ Login failed:', data.error);
      showNotification(data.error || 'Invalid credentials', 'error');
    }

  } catch (error) {
    console.error('❌ Login error:', error);
    showNotification('Login failed: ' + error.message, 'error');
  }
});

/**
 * Handle Signup Form Submission
 */
if (signupForm) {
  signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const role = document.getElementById('signupRole').value;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword || !role) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      showNotification('Password must be at least 6 characters long', 'error');
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      showNotification('Passwords do not match!', 'error');
      return;
    }

    console.log('Attempting signup:', { name, email, role });

    try {
      const response = await fetch('http://localhost:8081/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          role: role
        })
      });

      const data = await response.json();

      if (response.ok && data.id) {
        // Success! Save user info
        const user = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role
        };

        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log('✅ Signup successful!', user);

        showNotification('Account created successfully! 🎉', 'success');

        // Close modal
        signupModal.classList.remove('active');

        // Clear form
        signupForm.reset();

        // Redirect
        setTimeout(() => {
          redirectToDashboard(data.role);
        }, 1000);

      } else {
        console.error('❌ Signup failed:', data.error);
        showNotification(data.error || 'Signup failed', 'error');
      }

    } catch (error) {
      console.error('❌ Signup error:', error);
      showNotification('Signup failed: ' + error.message, 'error');
    }
  });
}

/**
 * Handle Signup Link Click - Open Modal
 */
if (signupLink) {
  signupLink.addEventListener('click', function(e) {
    e.preventDefault();
    if (signupModal) {
      signupModal.classList.add('active');
    }
  });
}

/**
 * Handle Close Button on Modal
 */
if (closeBtn) {
  closeBtn.addEventListener('click', function() {
    signupModal.classList.remove('active');
  });
}

/**
 * Close modal when clicking outside or pressing Escape
 */
window.addEventListener('click', function(event) {
  if (event.target == signupModal) {
    signupModal.classList.remove('active');
  }
});

/**
 * Close modal with Escape key
 */
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' && signupModal && signupModal.classList.contains('active')) {
    signupModal.classList.remove('active');
  }
});

/**
 * Redirect to appropriate dashboard
 */
function redirectToDashboard(role) {
  const dashboards = {
    'student': 'student/dashboard.html',
    'alumni': 'alumni/dashboard.html',
    'college': 'college/dashboard.html'
  };

  const url = dashboards[role] || 'student/dashboard.html';
  window.location.href = url;
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
  // Remove existing notification
  const existingNotif = document.querySelector('.notification');
  if (existingNotif) {
    existingNotif.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? '#2d7e3d' : type === 'error' ? '#c41c3b' : '#0066cc'};
    color: white;
    border-radius: 4px;
    z-index: 9999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    font-weight: 500;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.remove();
  }, 4000);
}

/**
 * Check if user is already logged in
 */
window.addEventListener('load', function() {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    const user = JSON.parse(currentUser);
    console.log('User already logged in:', user);
    // Auto redirect to dashboard
    redirectToDashboard(user.role);
  }
});

/**
 * Demo Account Autofill (Optional - for testing)
 */
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('demo-account-btn')) {
    const role = e.target.getAttribute('data-role');
    const account = DEMO_ACCOUNTS[role];
    
    document.getElementById('email').value = account.email;
    document.getElementById('password').value = account.password;
    
    // Set the role
    roleTabsButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-role="${role}"]`).classList.add('active');
    selectedRole = role;
    
    console.log('Autofilled demo account for:', role);
  }
});
