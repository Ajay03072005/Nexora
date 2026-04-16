/**
 * Student Dashboard JavaScript
 * Loads and displays student data from the AlumniHub API
 */

document.addEventListener('DOMContentLoaded', async function () {
  await loadDashboardData();
  await loadAcceptedMentorSessions();
  await loadFeaturedJobs();
  await loadUpcomingEvents();
});

/**
 * Load and display student dashboard data
 */
async function loadDashboardData() {
  try {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      console.warn('No current user found');
      showNotification('Please login first', 'warning');
      return;
    }

    // Update welcome message
    const heroContent = document.querySelector('.hero-content h1');
    if (heroContent) {
      heroContent.textContent = `Welcome Back, ${currentUser.name}! 👋`;
    }

    // Fetch student details - wrapped with better error handling
    try {
      // Try to fetch by user ID first
      let student = null;
      try {
        student = await StudentService.getStudentById(currentUser.id);
      } catch (idError) {
        // If ID lookup fails, try by email
        console.warn('Student lookup by ID failed, trying by email...');
        try {
          student = await StudentService.getStudentByEmail(currentUser.email);
        } catch (emailError) {
          console.warn('Student lookup by email also failed');
        }
      }
      
      if (student) {
        updateStats(student);
      }
    } catch (apiError) {
      console.warn('Could not fetch student data from API:', apiError.message);
      // Continue with default display - don't crash
      showNotification('Note: Using default display while backend loads', 'info');
    }
    
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    showNotification('Dashboard loaded (backend may be loading)', 'info');
  }
}

/**
 * Load accepted mentor assignments for the logged-in student.
 */
async function loadAcceptedMentorSessions() {
  const sessionsContainer = document.getElementById('sessionsContainer');
  if (!sessionsContainer) {
    return;
  }

  try {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      sessionsContainer.innerHTML = '<div class="empty-state">Please login to view your assigned sessions.</div>';
      return;
    }

    if (typeof StudentService === 'undefined') {
      sessionsContainer.innerHTML = '<div class="empty-state">Student services are unavailable.</div>';
      return;
    }

    let student = null;
    try {
      student = await StudentService.getStudentById(currentUser.id);
    } catch (idError) {
      try {
        student = await StudentService.getStudentByEmail(currentUser.email);
      } catch (emailError) {
        student = null;
      }
    }

    if (!student?.id) {
      sessionsContainer.innerHTML = '<div class="empty-state">No student profile found for this account.</div>';
      return;
    }

    const baseUrl = (typeof API_BASE_URL !== 'undefined' && API_BASE_URL) ? API_BASE_URL : 'http://localhost:8081/api';
    const response = await fetch(`${baseUrl}/connection-requests/student/${student.id}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const requests = await response.json();
    const accepted = (requests || []).filter((request) => (request.status || '').toUpperCase() === 'ACCEPTED');

    renderAcceptedMentorSessions(sessionsContainer, accepted);
  } catch (error) {
    console.error('Error loading accepted mentor sessions:', error);
    sessionsContainer.innerHTML = '<div class="empty-state">Unable to load assigned sessions right now.</div>';
  }
}

function renderAcceptedMentorSessions(container, requests) {
  if (!requests.length) {
    container.innerHTML = '<div class="empty-state">No accepted one-on-one sessions yet.</div>';
    return;
  }

  container.innerHTML = requests
    .sort((a, b) => new Date(b.responseDate || b.requestDate || 0) - new Date(a.responseDate || a.requestDate || 0))
    .map((request) => `
      <div class="session-card-full">
        <div class="session-card-header">
          <h3>${escapeHtml(request.topic || 'One-on-One Mentoring')}</h3>
          <span class="status confirmed">Accepted</span>
        </div>
        <div class="session-details-grid">
          <div>
            <p class="label">Mode</p>
            <p class="value">${escapeHtml(request.sessionMode || 'ONLINE')}</p>
          </div>
          <div>
            <p class="label">Preferred Date</p>
            <p class="value">${formatDateTime(request.preferredSessionDate)}</p>
          </div>
          <div>
            <p class="label">Assigned On</p>
            <p class="value">${formatDateTime(request.responseDate || request.assignedDate || request.requestDate)}</p>
          </div>
          <div>
            <p class="label">Request Type</p>
            <p class="value">${escapeHtml(request.requestType || 'MENTOR_ASSIGNMENT')}</p>
          </div>
        </div>
        <div style="margin-top: 1rem;">
          <p class="label">Message</p>
          <p>${escapeHtml(request.message || 'Your mentor has accepted this one-on-one session request.')}</p>
        </div>
      </div>
    `)
    .join('');
}

/**
 * Update quick stats from student data
 */
function updateStats(student) {
  const statsCards = document.querySelectorAll('.quick-stat-card');
  
  if (statsCards.length >= 4) {
    // These values could come from actual student data or API
    // For now, keeping display flexible - user can update with real data
    statsCards[0].querySelector('.quick-stat-number').textContent = student?.sessionsThisMonth || '—';
    statsCards[1].querySelector('.quick-stat-number').textContent = student?.averageRating || '—';
    statsCards[2].querySelector('.quick-stat-number').textContent = student?.jobApplications || '—';
    statsCards[3].querySelector('.quick-stat-number').textContent = student?.interviewCalls || '—';
  }
}

/**
 * Load and display featured job opportunities
 */
async function loadFeaturedJobs() {
  try {
    const jobs = await JobService.getOpenJobs();
    
    const jobsGrid = document.querySelector('.featured-jobs-grid');
    if (!jobsGrid || jobs.length === 0) {
      return;
    }

    // Clear existing cards and add real job data (show first 3)
    jobsGrid.innerHTML = jobs.slice(0, 3).map(job => `
      <div class="job-card-featured">
        <h3>${job.title}</h3>
        <p class="company-detail">${job.company}</p>
        <div class="job-details">
          <p><strong>📍 Location:</strong> ${job.location || 'Not specified'}</p>
          <p><strong>💼 Experience:</strong> ${job.experienceRequired || 'Not specified'}</p>
          <p><strong>💰 Salary:</strong> ${job.salary || 'Not disclosed'}</p>
        </div>
        <p class="job-description">${job.description?.substring(0, 100) || 'No description'}...</p>
        <button class="btn-primary" onclick="viewJob(${job.id})">View & Apply</button>
      </div>
    `).join('');

  } catch (error) {
    console.error('Error loading featured jobs:', error);
    // Keep mock data if API fails
  }
}

/**
 * Load and display upcoming events
 */
async function loadUpcomingEvents() {
  try {
    const events = await EventService.getUpcomingEvents();
    
    const eventsGrid = document.querySelector('.featured-events-grid');
    if (!eventsGrid || events.length === 0) {
      return;
    }

    // Clear existing cards and add real event data (show first 3)
    eventsGrid.innerHTML = events.slice(0, 3).map(event => {
      const eventDate = new Date(event.eventDate);
      const formattedDate = eventDate.toLocaleDateString('en-IN', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      return `
        <div class="event-card-featured">
          <h3>📅 ${formattedDate} - ${event.eventName}</h3>
          <p><strong>${eventDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST</strong> • ${event.location || 'Online'}</p>
          <p>${event.description || 'No description'}</p>
          <button class="btn-primary" onclick="registerEvent(${event.id})">Register</button>
        </div>
      `;
    }).join('');

  } catch (error) {
    console.error('Error loading upcoming events:', error);
    // Keep mock data if API fails
  }
}

/**
 * View job details
 */
function viewJob(jobId) {
  try {
    window.location.href = `jobs.html?jobId=${jobId}`;
  } catch (error) {
    console.error('Error navigating to job details:', error);
    showNotification('Error opening job details', 'error');
  }
}

/**
 * Register for event
 */
async function registerEvent(eventId) {
  try {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      showNotification('Please log in to register', 'warning');
      return;
    }

    showNotification('Event registration successful! 🎉', 'success');
    
  } catch (error) {
    console.error('Error registering for event:', error);
    showNotification('Error registering for event', 'error');
  }
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
  // Create a simple notification (you can enhance this with a toast library)
  console.log(`[${type.toUpperCase()}] ${message}`);
  
  // Optional: Create a visible notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? '#2d7e3d' : type === 'error' ? '#c41c3b' : '#0066cc'};
    color: white;
    border-radius: 4px;
    z-index: 9999;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function formatDateTime(value) {
  if (!value) {
    return '-';
  }

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    return '-';
  }

  return d.toLocaleString('en-IN');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
