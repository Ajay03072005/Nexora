/**
 * Alumni Dashboard
 * Shows mentor invites from college and supports accept/reject actions.
 */

const requestsContainer = document.getElementById('requestsContainer');
const sessionsContainer = document.getElementById('sessionsContainer');
const statsContainer = document.getElementById('statsContainer');
const impactContainer = document.getElementById('impactContainer');
const welcomeMessage = document.getElementById('welcomeMessage');
const requestsHeading = document.getElementById('requestsHeading');
const sessionsHeading = document.getElementById('sessionsHeading');

let currentUser = null;
let alumniProfile = null;
let profileSetupVisible = false;

document.addEventListener('DOMContentLoaded', async () => {
  const storedUser = localStorage.getItem('currentUser');
  if (!storedUser) {
    window.location.href = '../login.html';
    return;
  }

  currentUser = JSON.parse(storedUser);
  if ((currentUser.role || '').toLowerCase() !== 'alumni') {
    showNotification('Please login as alumni', 'error');
    return;
  }

  if (welcomeMessage) {
    welcomeMessage.textContent = `Welcome back, ${currentUser.name || 'Alumni'}! 👋`;
  }

  await loadAlumniProfile();
  if (!alumniProfile) {
      bindProfileForm();
      return;
  }

  await Promise.all([
      loadMentoringRequests(),
      loadAcceptedAssignments()
  ]);
});

async function loadAlumniProfile() {
  try {
    const response = await fetch(`${API_BASE_URL}/alumni/email/${encodeURIComponent(currentUser.email)}`);
    if (response.status === 404) {
      alumniProfile = null;
      showProfileSetup(true);
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    alumniProfile = await response.json();
    showProfileSetup(false);
    renderStats();
    renderImpact();
  } catch (error) {
    console.error('Failed to load alumni profile:', error);
    showNotification('Failed to load alumni profile', 'error');
  }
}

function showProfileSetup(show) {
  profileSetupVisible = show;

  const profileSetupSection = document.getElementById('profileSetupSection');
  const statsSection = document.getElementById('statsSection');
  const requestsSection = document.getElementById('requestsSection');
  const sessionsSection = document.getElementById('sessionsSection');
  const impactSection = document.getElementById('impactSection');

  if (profileSetupSection) {
    profileSetupSection.style.display = show ? 'block' : 'none';
  }

  [statsSection, requestsSection, sessionsSection, impactSection].forEach((section) => {
    if (section) {
      section.style.display = show ? 'none' : 'block';
    }
  });

  if (show) {
    showNotification('Please create your alumni profile to view mentorship requests.', 'info');
  }
}

function bindProfileForm() {
  const form = document.getElementById('alumniProfileForm');
  if (!form || form.dataset.bound === 'true') {
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
      await createProfile();
      await loadAlumniProfile();

      if (!alumniProfile) {
        throw new Error('Profile creation failed. Please try again.');
      }

      await Promise.all([loadMentoringRequests(), loadAcceptedAssignments()]);
      showNotification('Profile created successfully.', 'success');
    } catch (error) {
      console.error('Failed to create alumni profile:', error);
      showNotification(error.message || 'Failed to create profile', 'error');
    }
  });

  form.dataset.bound = 'true';
}

async function createProfile() {
  const department = document.getElementById('profileDepartment')?.value?.trim();
  const graduationYear = document.getElementById('profileGraduationYear')?.value?.trim();
  const currentCompany = document.getElementById('profileCompany')?.value?.trim() || '';
  const currentDesignation = document.getElementById('profileDesignation')?.value?.trim() || '';
  const industry = document.getElementById('profileIndustry')?.value?.trim() || '';
  const profilePicture = document.getElementById('profilePicture')?.value?.trim() || '';
  const bio = document.getElementById('profileBio')?.value?.trim() || '';
  const isAvailableForMentoring = document.getElementById('profileMentoring')?.checked ?? true;
  const isAvailableForHiring = document.getElementById('profileHiring')?.checked ?? false;

  if (!department || !graduationYear) {
    throw new Error('Department and Graduation Year are required.');
  }

  const payload = {
    name: currentUser.name || currentUser.email,
    email: currentUser.email,
    department,
    graduationYear,
    currentCompany,
    currentDesignation,
    industry,
    profilePicture,
    bio,
    isAvailableForMentoring,
    isAvailableForHiring
  };

  const response = await fetch(`${API_BASE_URL}/alumni`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP ${response.status}`);
  }
}

async function loadMentoringRequests() {
  if (!alumniProfile?.id) {
    requestsContainer.innerHTML = '<p style="color:#b91c1c;">Alumni profile not found. Please complete alumni profile first.</p>';
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/connection-requests/alumni/${alumniProfile.id}/pending`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const requests = await response.json();
    renderPendingRequests(requests || []);
  } catch (error) {
    console.error('Failed to load mentoring requests:', error);
    requestsContainer.innerHTML = '<p style="color:#b91c1c;">Failed to load pending requests.</p>';
  }
}

async function loadAcceptedAssignments() {
  if (!alumniProfile?.id) {
    sessionsContainer.innerHTML = '<p style="color:#6b7280;">No assignments found.</p>';
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/connection-requests/alumni/${alumniProfile.id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const requests = await response.json();
    const accepted = (requests || []).filter(r => (r.status || '').toUpperCase() === 'ACCEPTED');
    renderAcceptedAssignments(accepted);
  } catch (error) {
    console.error('Failed to load accepted assignments:', error);
    sessionsContainer.innerHTML = '<p style="color:#b91c1c;">Failed to load accepted sessions.</p>';
  }
}

function renderPendingRequests(requests) {
  if (!requestsContainer) return;

  requestsHeading.textContent = `Pending Session Requests (${requests.length})`;

  if (!requests.length) {
    requestsContainer.innerHTML = '<div class="empty-state">No pending requests right now.</div>';
    return;
  }

  requestsContainer.innerHTML = requests.map((request) => `
    <div class="request-card">
      <h3>${escapeHtml(request.topic || 'One-on-One Mentoring')}</h3>
      <p><strong>Student ID:</strong> ${escapeHtml(request.studentId || '-')}</p>
      <p><strong>Mode:</strong> ${escapeHtml(request.sessionMode || 'ONLINE')}</p>
      <p><strong>Preferred:</strong> ${formatDateTime(request.preferredSessionDate)}</p>
      <p><strong>Message:</strong> ${escapeHtml(request.message || '-')}</p>
      <div style="display:flex;gap:0.5rem;margin-top:0.75rem;">
        <button class="btn-primary" onclick="respondToRequest(${request.id}, 'ACCEPTED')">Accept</button>
        <button class="btn-secondary" onclick="respondToRequest(${request.id}, 'REJECTED')">Decline</button>
      </div>
    </div>
  `).join('');
}

function renderAcceptedAssignments(assignments) {
  if (!sessionsContainer) return;

  sessionsHeading.textContent = `Your Upcoming Sessions (${assignments.length})`;

  if (!assignments.length) {
    sessionsContainer.innerHTML = '<div class="empty-state">No accepted one-on-one assignments yet.</div>';
    return;
  }

  sessionsContainer.innerHTML = assignments.map((request) => `
    <div class="history-item">
      <div class="history-header">
        <h4>${escapeHtml(request.topic || 'One-on-One Mentoring')}</h4>
        <span class="status-tag">Accepted</span>
      </div>
      <p><strong>Student ID:</strong> ${escapeHtml(request.studentId || '-')}</p>
      <p><strong>Mode:</strong> ${escapeHtml(request.sessionMode || 'ONLINE')}</p>
      <p><strong>Preferred Date:</strong> ${formatDateTime(request.preferredSessionDate)}</p>
      <p><strong>Assigned:</strong> ${formatDateTime(request.assignedDate)}</p>
    </div>
  `).join('');
}

async function respondToRequest(requestId, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/connection-requests/${requestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    showNotification(`Request ${status === 'ACCEPTED' ? 'accepted' : 'declined'} successfully`, 'success');
    await Promise.all([loadMentoringRequests(), loadAcceptedAssignments()]);
  } catch (error) {
    console.error('Failed to respond to request:', error);
    showNotification('Failed to update request', 'error');
  }
}

function renderStats() {
  if (!statsContainer || !alumniProfile) return;

  statsContainer.innerHTML = `
    <div class="quick-stat-card">
      <div class="quick-stat-number">${alumniProfile.isAvailableForMentoring ? 'Yes' : 'No'}</div>
      <div class="quick-stat-label">Mentoring Available</div>
    </div>
    <div class="quick-stat-card">
      <div class="quick-stat-number">${escapeHtml(alumniProfile.currentCompany || '-')}</div>
      <div class="quick-stat-label">Current Company</div>
    </div>
    <div class="quick-stat-card">
      <div class="quick-stat-number">${escapeHtml(alumniProfile.currentDesignation || '-')}</div>
      <div class="quick-stat-label">Current Role</div>
    </div>
    <div class="quick-stat-card">
      <div class="quick-stat-number">${escapeHtml(alumniProfile.graduationYear || '-')}</div>
      <div class="quick-stat-label">Graduation Year</div>
    </div>
  `;
}

function renderImpact() {
  if (!impactContainer || !alumniProfile) return;

  impactContainer.innerHTML = `
    <div class="quick-stat-card">
      <div class="quick-stat-number">${escapeHtml(alumniProfile.industry || '-')}</div>
      <div class="quick-stat-label">Industry</div>
    </div>
    <div class="quick-stat-card">
      <div class="quick-stat-number">${alumniProfile.isAvailableForHiring ? 'Yes' : 'No'}</div>
      <div class="quick-stat-label">Hiring Available</div>
    </div>
    <div class="quick-stat-card">
      <div class="quick-stat-number">${escapeHtml(alumniProfile.department || '-')}</div>
      <div class="quick-stat-label">Department</div>
    </div>
    <div class="quick-stat-card">
      <div class="quick-stat-number">1:1</div>
      <div class="quick-stat-label">Mentorship Mode</div>
    </div>
  `;
}

function formatDateTime(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString('en-IN');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showNotification(message, type = 'info') {
  const existingNotif = document.querySelector('.notification');
  if (existingNotif) {
    existingNotif.remove();
  }

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 16px;
    background: ${type === 'success' ? '#2d7e3d' : type === 'error' ? '#c41c3b' : '#0066cc'};
    color: white;
    border-radius: 4px;
    z-index: 9999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    font-weight: 500;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
