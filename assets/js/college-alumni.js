/**
 * College Alumni Page
 * Invite alumni for mentoring and track invite status.
 */

const inviteAlumniSelect = document.getElementById('inviteAlumniSelect');
const inviteStudentSelect = document.getElementById('inviteStudentSelect');
const inviteTopicInput = document.getElementById('inviteTopicInput');
const inviteModeSelect = document.getElementById('inviteModeSelect');
const inviteDateInput = document.getElementById('inviteDateInput');
const inviteMessageInput = document.getElementById('inviteMessageInput');
const sendAlumniInviteBtn = document.getElementById('sendAlumniInviteBtn');

const totalMentorsStat = document.getElementById('totalMentorsStat');
const activeMentorsStat = document.getElementById('activeMentorsStat');
const studentsMentoredStat = document.getElementById('studentsMentoredStat');
const pendingInvitesStat = document.getElementById('pendingInvitesStat');
const alumniHeading = document.getElementById('alumniHeading');
const alumniTableBody = document.getElementById('alumniTableBody');
const userRole = document.getElementById('userRole');

let currentUser = null;
let alumniList = [];
let students = [];
let requests = [];

document.addEventListener('DOMContentLoaded', async () => {
  const storedUser = localStorage.getItem('currentUser');
  if (!storedUser) {
    window.location.href = '../login.html';
    return;
  }

  currentUser = JSON.parse(storedUser);
  if ((currentUser.role || '').toLowerCase() !== 'college') {
    alert('Only college administrators can access this page');
    window.location.href = '../index.html';
    return;
  }

  if (userRole) {
    userRole.textContent = `${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}`;
  }

  await Promise.all([loadAlumni(), loadStudents()]);
  await loadRequests();
  renderPage();

  sendAlumniInviteBtn.addEventListener('click', sendAlumniInvite);
});

async function loadAlumni() {
  try {
    alumniList = await AlumniService.getAllAlumni();
  } catch (error) {
    console.error('Failed to load alumni:', error);
    alumniList = [];
  }
}

async function loadStudents() {
  try {
    students = await StudentService.getAllStudents();
  } catch (error) {
    console.error('Failed to load students:', error);
    students = [];
  }
}

async function loadRequests() {
  try {
    const response = await fetch(`http://localhost:8081/api/connection-requests/college/${currentUser.id}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    requests = await response.json();
  } catch (error) {
    console.error('Failed to load alumni invites:', error);
    requests = [];
  }
}

function renderPage() {
  renderSelectors();
  renderStats();
  renderAlumniTable();
}

function renderSelectors() {
  inviteAlumniSelect.innerHTML = '<option value="">Select Alumni Mentor...</option>';
  alumniList.forEach((alumni) => {
    const option = document.createElement('option');
    option.value = alumni.id;
    option.textContent = `${alumni.name} (${alumni.email})`;
    inviteAlumniSelect.appendChild(option);
  });

  inviteStudentSelect.innerHTML = '<option value="">Select Student (optional)...</option>';
  students.forEach((student) => {
    const option = document.createElement('option');
    option.value = student.id;
    option.textContent = `${student.name} (${student.registrationNumber || student.enrollmentNumber || student.id})`;
    inviteStudentSelect.appendChild(option);
  });
}

function renderStats() {
  const pendingCount = requests.filter((r) => (r.status || '').toUpperCase() === 'PENDING').length;
  const acceptedCount = requests.filter((r) => (r.status || '').toUpperCase() === 'ACCEPTED').length;

  totalMentorsStat.textContent = String(alumniList.length);
  activeMentorsStat.textContent = String(alumniList.filter((a) => a.isAvailableForMentoring).length);
  studentsMentoredStat.textContent = String(acceptedCount);
  pendingInvitesStat.textContent = String(pendingCount);
}

function renderAlumniTable() {
  alumniHeading.textContent = `Alumni Mentors (${alumniList.length})`;

  if (!alumniList.length) {
    alumniTableBody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:#888;">No alumni found</td></tr>';
    return;
  }

  alumniTableBody.innerHTML = alumniList.map((alumni) => {
    const latestInvite = getLatestInviteForAlumni(alumni.id);
    const inviteStatus = latestInvite ? (latestInvite.status || 'PENDING').toUpperCase() : 'NO INVITE';
    const requestType = latestInvite ? (latestInvite.requestType || '-') : '-';

    return `
      <tr>
        <td>${escapeHtml(alumni.name || '-')}</td>
        <td>${escapeHtml(alumni.graduationYear || '-')}</td>
        <td>${escapeHtml(alumni.currentCompany || '-')}</td>
        <td>${escapeHtml(alumni.currentDesignation || '-')}</td>
        <td>${escapeHtml(alumni.email || '-')}</td>
        <td>${alumni.isAvailableForMentoring ? 'Yes' : 'No'}</td>
        <td>${escapeHtml(`${inviteStatus} (${requestType})`)}</td>
        <td><span class="status ${alumni.isAvailableForMentoring ? 'confirmed' : 'pending'}">${alumni.isAvailableForMentoring ? 'Active' : 'Inactive'}</span></td>
        <td>
          <button class="btn-outline-small" style="font-size:0.75rem;" onclick="prefillInvite(${alumni.id})">Invite</button>
        </td>
      </tr>
    `;
  }).join('');
}

function getLatestInviteForAlumni(alumniId) {
  return requests
    .filter((r) => r.alumniId === alumniId)
    .sort((a, b) => new Date(b.requestDate || 0) - new Date(a.requestDate || 0))[0];
}

function prefillInvite(alumniId) {
  inviteAlumniSelect.value = String(alumniId);
  inviteTopicInput.focus();
}

async function sendAlumniInvite() {
  const alumniId = Number(inviteAlumniSelect.value);
  const studentId = inviteStudentSelect.value ? Number(inviteStudentSelect.value) : null;
  const topic = (inviteTopicInput.value || '').trim();
  const sessionMode = inviteModeSelect.value || 'ONLINE';
  const preferredSessionDate = inviteDateInput.value ? new Date(inviteDateInput.value).toISOString() : null;
  const message = (inviteMessageInput.value || '').trim();

  if (!alumniId || !topic) {
    showNotification('Please select alumni and topic', 'error');
    return;
  }

  const payload = {
    fromUserId: currentUser.id,
    toUserId: alumniId,
    requestType: studentId ? 'MENTOR_ASSIGNMENT' : 'MENTOR_INVITE',
    collegeId: currentUser.id,
    studentId,
    alumniId,
    topic,
    sessionMode,
    preferredSessionDate,
    message,
    status: 'PENDING'
  };

  try {
    await ConnectionRequestService.createConnectionRequest(payload);
    showNotification('Invite sent to alumni successfully', 'success');

    inviteTopicInput.value = '';
    inviteMessageInput.value = '';
    inviteDateInput.value = '';
    inviteStudentSelect.value = '';

    await loadRequests();
    renderPage();
  } catch (error) {
    console.error('Failed to send alumni invite:', error);
    showNotification('Failed to send invite', 'error');
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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
