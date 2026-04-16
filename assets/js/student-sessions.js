/**
 * Student sessions page: show accepted sessions, internal-call join, and report view without marks.
 */

const STUDENT_SESSIONS_API_BASE = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:8081/api';

let studentSessionsUser = null;
let studentSessionsProfile = null;

document.addEventListener('DOMContentLoaded', async () => {
  const rawUser = localStorage.getItem('currentUser');
  if (!rawUser) {
    window.location.href = '../login.html';
    return;
  }

  studentSessionsUser = JSON.parse(rawUser);
  if ((studentSessionsUser.role || '').toLowerCase() !== 'student') {
    window.location.href = '../login.html';
    return;
  }

  await resolveStudentProfile();
  await loadStudentSessionsAndReports();
});

async function resolveStudentProfile() {
  try {
    studentSessionsProfile = await StudentService.getStudentById(studentSessionsUser.id);
  } catch (idError) {
    studentSessionsProfile = await StudentService.getStudentByEmail(studentSessionsUser.email);
  }
}

async function loadStudentSessionsAndReports() {
  const upcoming = document.getElementById('upcomingList');
  const completed = document.getElementById('completedList');

  if (!upcoming || !completed) {
    return;
  }

  try {
    const [sessionsResp, reportsResp] = await Promise.all([
      fetch(`${STUDENT_SESSIONS_API_BASE}/connection-requests/student/${studentSessionsProfile.id}`),
      fetch(`${STUDENT_SESSIONS_API_BASE}/connection-requests/student/${studentSessionsProfile.id}/reports`)
    ]);

    if (!sessionsResp.ok || !reportsResp.ok) {
      throw new Error('Failed to load sessions or reports.');
    }

    const sessions = await sessionsResp.json();
    const reports = await reportsResp.json();

    const accepted = (sessions || []).filter((request) => (request.status || '').toUpperCase() === 'ACCEPTED');

    if (!accepted.length) {
      upcoming.innerHTML = '<div class="session-card-full">No accepted one-on-one sessions yet.</div>';
    } else {
      upcoming.innerHTML = accepted
        .sort((a, b) => new Date(b.scheduledSessionDate || b.assignedDate || 0) - new Date(a.scheduledSessionDate || a.assignedDate || 0))
        .map((session) => renderStudentAcceptedSession(session))
        .join('');
    }

    if (!reports.length) {
      completed.innerHTML = '<div class="application-item"><h3>No session reports yet.</h3></div>';
    } else {
      completed.innerHTML = reports
        .sort((a, b) => new Date(b.reportGeneratedAt || 0) - new Date(a.reportGeneratedAt || 0))
        .map((report) => renderStudentReport(report))
        .join('');
    }
  } catch (error) {
    console.error('Failed to load student sessions and reports:', error);
    upcoming.innerHTML = '<div class="session-card-full" style="color:#b91c1c;">Unable to load sessions.</div>';
    completed.innerHTML = '<div class="application-item" style="color:#b91c1c;">Unable to load reports.</div>';
  }
}

function renderStudentAcceptedSession(session) {
  const roomId = session.meetingRoomId || `room-${session.id}`;
  return `
    <div class="session-card-full">
      <div class="session-card-header">
        <h3>${escapeHtml(session.topic || 'One-on-One Mentoring')}</h3>
        <span class="status confirmed">Accepted</span>
      </div>
      <div class="session-details-grid">
        <div>
          <p class="label">Mode</p>
          <p class="value">${escapeHtml(session.sessionMode || 'ONLINE')}</p>
        </div>
        <div>
          <p class="label">Scheduled Date</p>
          <p class="value">${formatDateTime(session.scheduledSessionDate || session.preferredSessionDate)}</p>
        </div>
        <div>
          <p class="label">Meeting Room</p>
          <p class="value">${escapeHtml(roomId)}</p>
        </div>
        <div>
          <p class="label">Request Type</p>
          <p class="value">${escapeHtml(session.requestType || 'MENTOR_ASSIGNMENT')}</p>
        </div>
      </div>
      <div style="margin-top:1rem;display:flex;gap:0.5rem;">
        <button class="btn-primary" onclick="openStudentPortalVideo('${escapeJs(roomId)}', '${escapeJs(session.topic || 'One-on-One Session')}')">Join Call In Portal</button>
      </div>
    </div>
  `;
}

function renderStudentReport(report) {
  return `
    <div class="application-item">
      <div class="application-header">
        <h3>${escapeHtml(report.topic || 'One-on-One Mentoring')}</h3>
        <span class="status confirmed">Report Available</span>
      </div>
      <p class="company-info-text">${escapeHtml(report.reportSummary || 'Session report summary provided by alumni.')}</p>
      <p class="applied-date">Student Feedback: ${escapeHtml(report.reportForStudent || '-')}</p>
      <p class="applied-date">Generated: ${formatDateTime(report.reportGeneratedAt)}</p>
    </div>
  `;
}

function openStudentPortalVideo(roomId, topic) {
  const modal = document.getElementById('studentVideoPortalModal');
  const frame = document.getElementById('studentVideoPortalFrame');
  const title = document.getElementById('studentVideoPortalTitle');

  if (!modal || !frame) {
    return;
  }

  frame.src = `https://meet.jit.si/${encodeURIComponent(roomId)}#config.startWithAudioMuted=false`;
  if (title) {
    title.textContent = `Portal Video Call - ${topic || 'Session'}`;
  }
  modal.style.display = 'block';
}

function closeStudentPortalVideo() {
  const modal = document.getElementById('studentVideoPortalModal');
  const frame = document.getElementById('studentVideoPortalFrame');
  if (frame) {
    frame.src = '';
  }
  if (modal) {
    modal.style.display = 'none';
  }
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
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeJs(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\"/g, '\\"');
}

window.openStudentPortalVideo = openStudentPortalVideo;
window.closeStudentPortalVideo = closeStudentPortalVideo;
