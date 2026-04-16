/**
 * College Sessions Page
 * Invite alumni mentors and assign students for one-on-one mentoring.
 */

const studentSelect = document.getElementById('studentSelect');
const mentorSelect = document.getElementById('mentorSelect');
const topicInput = document.getElementById('topicInput');
const modeSelect = document.getElementById('modeSelect');
const preferredDateInput = document.getElementById('preferredDateInput');
const messageInput = document.getElementById('messageInput');
const sendInviteBtn = document.getElementById('sendInviteBtn');
const assignmentRequestsBody = document.getElementById('assignmentRequestsBody');
const userRole = document.getElementById('userRole');

let currentUser = null;
let students = [];
let mentors = [];

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

  await Promise.all([loadStudents(), loadMentors()]);
  await loadAssignments();

  sendInviteBtn.addEventListener('click', sendInviteAndAssign);
});

async function loadStudents() {
  try {
    const response = await fetch(`${API_BASE_URL}/students`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    students = await response.json();
    studentSelect.innerHTML = '<option value="">Select Student...</option>';
    students.forEach((student) => {
      const option = document.createElement('option');
      option.value = student.id;
      option.textContent = `${student.name || 'Student'} (${student.registrationNumber || student.enrollmentNumber || student.id})`;
      studentSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to load students:', error);
    showNotification('Failed to load students', 'error');
  }
}

async function loadMentors() {
  try {
    const mentorResponse = await fetch(`${API_BASE_URL}/alumni/mentors/available`);
    if (mentorResponse.ok) {
      mentors = await mentorResponse.json();
    } else {
      const fallbackResponse = await fetch(`${API_BASE_URL}/alumni`);
      if (!fallbackResponse.ok) throw new Error(`HTTP ${fallbackResponse.status}`);
      mentors = await fallbackResponse.json();
    }

    mentorSelect.innerHTML = '<option value="">Select Mentor...</option>';
    mentors.forEach((mentor) => {
      const option = document.createElement('option');
      option.value = mentor.id;
      option.textContent = `${mentor.name || 'Alumni'} (${mentor.email || '-'})`;
      mentorSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to load mentors:', error);
    showNotification('Failed to load mentors', 'error');
  }
}

async function sendInviteAndAssign() {
  const studentId = Number(studentSelect.value);
  const alumniId = Number(mentorSelect.value);
  const topic = (topicInput.value || '').trim();
  const message = (messageInput.value || '').trim();
  const sessionMode = modeSelect.value || 'ONLINE';
  const preferredSessionDate = preferredDateInput.value ? new Date(preferredDateInput.value).toISOString() : null;

  if (!studentId || !alumniId || !topic) {
    showNotification('Please select student, mentor and topic', 'error');
    return;
  }

  try {
    const payload = {
      fromUserId: currentUser.id,
      toUserId: alumniId,
      requestType: 'MENTOR_ASSIGNMENT',
      collegeId: currentUser.id,
      studentId,
      alumniId,
      topic,
      sessionMode,
      preferredSessionDate,
      message,
      status: 'PENDING'
    };

    const response = await fetch(`${API_BASE_URL}/connection-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    topicInput.value = '';
    messageInput.value = '';
    preferredDateInput.value = '';

    showNotification('Invite sent and student assigned to mentor successfully', 'success');
    await loadAssignments();
  } catch (error) {
    console.error('Failed to send invite:', error);
    showNotification('Failed to send mentor invite', 'error');
  }
}

async function loadAssignments() {
  try {
    const response = await fetch(`${API_BASE_URL}/connection-requests/college/${currentUser.id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const requests = await response.json();
    renderAssignments(requests || []);
  } catch (error) {
    console.error('Failed to load assignments:', error);
    assignmentRequestsBody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#c41c3b;">Failed to load assignment requests</td></tr>';
  }
}

function renderAssignments(requests) {
  if (!requests.length) {
    assignmentRequestsBody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#888;">No assignment requests yet</td></tr>';
    return;
  }

  assignmentRequestsBody.innerHTML = requests
    .sort((a, b) => new Date(b.requestDate || 0) - new Date(a.requestDate || 0))
    .map((request) => {
      const student = students.find((s) => s.id === request.studentId);
      const mentor = mentors.find((m) => m.id === request.alumniId);
      const status = (request.status || 'PENDING').toUpperCase();

      return `
        <tr>
          <td>${formatDateTime(request.requestDate)}</td>
          <td>${escapeHtml(student?.name || `Student #${request.studentId || '-'}`)}</td>
          <td>${escapeHtml(mentor?.name || `Mentor #${request.alumniId || '-'}`)}</td>
          <td>${escapeHtml(request.topic || '-')}</td>
          <td>${escapeHtml(request.sessionMode || '-')}</td>
          <td>${formatDateTime(request.preferredSessionDate)}</td>
          <td>${renderStatus(status)}</td>
          <td>${renderActions(request.id, status)}</td>
        </tr>
      `;
    })
    .join('');
}

function renderStatus(status) {
  const color =
    status === 'ACCEPTED' ? '#166534' :
    status === 'REJECTED' ? '#b91c1c' :
    '#78350f';

  const background =
    status === 'ACCEPTED' ? '#dcfce7' :
    status === 'REJECTED' ? '#fee2e2' :
    '#fef3c7';

  return `<span style="background:${background};color:${color};padding:0.25rem 0.75rem;border-radius:4px;font-size:0.875rem;">${status}</span>`;
}

function renderActions(id, status) {
  if (status === 'PENDING') {
    return `<button class="btn-outline-small" style="font-size:0.75rem;" onclick="cancelInvite(${id})">Cancel</button>`;
  }
  return '-';
}

async function cancelInvite(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/connection-requests/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    showNotification('Invite cancelled', 'success');
    await loadAssignments();
  } catch (error) {
    console.error('Failed to cancel invite:', error);
    showNotification('Failed to cancel invite', 'error');
  }
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
