/**
 * Alumni Requests Page
 * Inbox for college mentoring invites and assignments.
 */

const userRole = document.getElementById('userRole');
const pendingHeading = document.getElementById('pendingHeading');
const historyHeading = document.getElementById('historyHeading');
const pendingRequestsContainer = document.getElementById('pendingRequestsContainer');
const requestHistoryContainer = document.getElementById('requestHistoryContainer');

let currentUser = null;
let alumniProfile = null;

// Student cache for better labels
let students = [];

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

  if (userRole) {
    userRole.textContent = `${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}`;
  }

  await Promise.all([loadAlumniProfile(), loadStudents()]);
  await loadRequests();
});

async function loadAlumniProfile() {
  const response = await fetch(`http://localhost:8081/api/alumni/email/${encodeURIComponent(currentUser.email)}`);
  if (!response.ok) {
    throw new Error('Alumni profile not found. Please ensure alumni email exists in alumni table.');
  }
  alumniProfile = await response.json();
}

async function loadStudents() {
  try {
    students = await StudentService.getAllStudents();
  } catch (error) {
    students = [];
  }
}

async function loadRequests() {
  if (!alumniProfile?.id) {
    pendingRequestsContainer.innerHTML = '<div style="background:#fff;padding:1rem;border-radius:8px;color:#b91c1c;">Alumni profile not found.</div>';
    requestHistoryContainer.innerHTML = '';
    return;
  }

  try {
    const response = await fetch(`http://localhost:8081/api/connection-requests/alumni/${alumniProfile.id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const requests = await response.json();
    const pending = requests.filter(r => (r.status || '').toUpperCase() === 'PENDING');
    const history = requests.filter(r => (r.status || '').toUpperCase() !== 'PENDING');

    renderPending(pending);
    renderHistory(history);
  } catch (error) {
    console.error('Failed loading requests', error);
    pendingRequestsContainer.innerHTML = '<div style="background:#fff;padding:1rem;border-radius:8px;color:#b91c1c;">Failed to load requests.</div>';
    requestHistoryContainer.innerHTML = '';
  }
}

function renderPending(requests) {
  pendingHeading.textContent = `Pending Requests (${requests.length})`;

  if (!requests.length) {
    pendingRequestsContainer.innerHTML = '<div style="background:#fff;padding:1rem;border-radius:8px;color:#666;">No pending requests</div>';
    return;
  }

  pendingRequestsContainer.innerHTML = requests.map((request) => {
    const student = students.find(s => s.id === request.studentId);
    return `
      <div class="request-card-detailed">
        <div class="request-header">
          <div style="display:flex;align-items:center;gap:1rem;">
            <div class="avatar-small">👨‍🎓</div>
            <div>
              <h3 style="margin:0;">${escapeHtml(student?.name || `Student #${request.studentId || '-'}`)}</h3>
              <p style="margin:0;color:#666;font-size:0.875rem;">Request Type: ${escapeHtml(request.requestType || 'MENTOR_INVITE')}</p>
            </div>
          </div>
          <span class="status pending">Pending</span>
        </div>
        <div style="padding:1rem;background:#f9fafb;">
          <p><strong>Topic:</strong> ${escapeHtml(request.topic || '-')}</p>
          <p><strong>Mode:</strong> ${escapeHtml(request.sessionMode || '-')}</p>
          <p><strong>Preferred Date:</strong> ${formatDateTime(request.preferredSessionDate)}</p>
          <p><strong>Message:</strong> ${escapeHtml(request.message || '-')}</p>
          <p><strong>Requested on:</strong> ${formatDateTime(request.requestDate)}</p>
        </div>
        <div style="padding:1rem;display:flex;gap:0.5rem;justify-content:flex-end;">
          <button class="btn-primary" onclick="respondToInvite(${request.id}, 'ACCEPTED')">Accept</button>
          <button class="btn-secondary" onclick="respondToInvite(${request.id}, 'REJECTED')">Decline</button>
        </div>
      </div>
    `;
  }).join('');
}

function renderHistory(requests) {
  historyHeading.textContent = `Request History (${requests.length})`;

  if (!requests.length) {
    requestHistoryContainer.innerHTML = '<div style="background:#fff;padding:1rem;border-radius:8px;color:#666;">No completed request history</div>';
    return;
  }

  requestHistoryContainer.innerHTML = requests
    .sort((a, b) => new Date(b.responseDate || b.requestDate || 0) - new Date(a.responseDate || a.requestDate || 0))
    .map((request) => {
      const student = students.find(s => s.id === request.studentId);
      const status = (request.status || '-').toUpperCase();
      return `
        <div class="history-item" style="background:#fff;border-left:4px solid ${status === 'ACCEPTED' ? '#10b981' : '#ef4444'};padding:1rem;margin-bottom:0.75rem;border-radius:6px;">
          <h4 style="margin:0 0 0.5rem 0;">${escapeHtml(student?.name || `Student #${request.studentId || '-'}`)} - ${escapeHtml(request.topic || '-')}</h4>
          <p style="margin:0.25rem 0;color:#555;">Status: <strong>${status}</strong></p>
          <p style="margin:0.25rem 0;color:#555;">Responded: ${formatDateTime(request.responseDate)}</p>
        </div>
      `;
    })
    .join('');
}

async function respondToInvite(requestId, status) {
  try {
    const response = await fetch(`http://localhost:8081/api/connection-requests/${requestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    showNotification(`Request ${status === 'ACCEPTED' ? 'accepted' : 'declined'}`, 'success');
    await loadRequests();
  } catch (error) {
    console.error('Failed to respond', error);
    showNotification('Failed to update request', 'error');
  }
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

  setTimeout(() => notification.remove(), 3000);
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
