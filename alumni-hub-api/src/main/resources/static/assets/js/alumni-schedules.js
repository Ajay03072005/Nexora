/**
 * Alumni schedules: schedule accepted 1:1 sessions, run call inside portal, and submit report.
 */

const ALUMNI_API_BASE = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:8081/api';

let alumniScheduleUser = null;
let alumniScheduleProfile = null;
let alumniAcceptedSessions = [];

document.addEventListener('DOMContentLoaded', async () => {
  const rawUser = localStorage.getItem('currentUser');
  if (!rawUser) {
    window.location.href = '../login.html';
    return;
  }

  alumniScheduleUser = JSON.parse(rawUser);
  if ((alumniScheduleUser.role || '').toLowerCase() !== 'alumni') {
    window.location.href = '../login.html';
    return;
  }

  await loadAlumniScheduleProfile();
  await loadAlumniAcceptedSessions();
});

async function loadAlumniScheduleProfile() {
  const response = await fetch(`${ALUMNI_API_BASE}/alumni/email/${encodeURIComponent(alumniScheduleUser.email)}`);
  if (!response.ok) {
    throw new Error('Alumni profile not found. Please complete your profile first.');
  }
  alumniScheduleProfile = await response.json();
}

async function loadAlumniAcceptedSessions() {
  const list = document.getElementById('alumniSessionList');
  if (!list) {
    return;
  }

  try {
    const response = await fetch(`${ALUMNI_API_BASE}/connection-requests/alumni/${alumniScheduleProfile.id}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const all = await response.json();
    alumniAcceptedSessions = (all || []).filter((request) => (request.status || '').toUpperCase() === 'ACCEPTED');

    if (!alumniAcceptedSessions.length) {
      list.innerHTML = '<div class="history-item">No accepted one-on-one sessions yet.</div>';
      return;
    }

    list.innerHTML = alumniAcceptedSessions
      .sort((a, b) => new Date(b.assignedDate || b.requestDate || 0) - new Date(a.assignedDate || a.requestDate || 0))
      .map((session) => renderAlumniSessionCard(session))
      .join('');
  } catch (error) {
    console.error('Failed loading alumni accepted sessions:', error);
    list.innerHTML = '<div class="history-item" style="color:#b91c1c;">Failed to load sessions.</div>';
  }
}

function renderAlumniSessionCard(session) {
  const roomId = session.meetingRoomId || `room-${session.id}`;
  const reportSummary = session.reportSummary || '';
  const reportForStudent = session.reportForStudent || '';

  return `
    <div class="history-item" style="display:block;">
      <div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
        <div>
          <h4 style="margin:0;">${escapeHtml(session.topic || 'One-on-One Mentoring')}</h4>
          <p style="margin:0.35rem 0;color:#555;font-size:0.9rem;">Student ID: ${escapeHtml(session.studentId || '-')} | Mode: ${escapeHtml(session.sessionMode || 'ONLINE')}</p>
          <p style="margin:0;color:#777;font-size:0.85rem;">Scheduled: ${formatDateTime(session.scheduledSessionDate)} | Room: ${escapeHtml(roomId)}</p>
        </div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:flex-start;">
          <button class="btn-outline-small" onclick="openScheduleEditor(${session.id})">Schedule</button>
          <button class="btn-primary" onclick="openPortalVideo('${escapeJs(roomId)}', '${escapeJs(session.topic || 'One-on-One Session')}')">Start Call</button>
        </div>
      </div>

      <div id="scheduleEditor-${session.id}" style="display:none;margin-top:0.75rem;padding:0.75rem;background:#f8fafc;border:1px solid #e5e7eb;border-radius:6px;">
        <label style="display:block;font-size:0.85rem;color:#334155;margin-bottom:0.35rem;">Session Date & Time</label>
        <input id="scheduleDate-${session.id}" type="datetime-local" style="padding:0.5rem;border:1px solid #cbd5e1;border-radius:4px;width:260px;max-width:100%;" value="${toDateTimeLocalValue(session.scheduledSessionDate)}">
        <label style="display:block;font-size:0.85rem;color:#334155;margin:0.6rem 0 0.35rem;">Meeting Room ID</label>
        <input id="scheduleRoom-${session.id}" type="text" style="padding:0.5rem;border:1px solid #cbd5e1;border-radius:4px;width:260px;max-width:100%;" value="${escapeHtml(roomId)}">
        <div style="margin-top:0.6rem;">
          <button class="btn-primary" onclick="saveSessionSchedule(${session.id})">Save Schedule</button>
        </div>
      </div>

      <div style="margin-top:0.75rem;padding:0.75rem;background:#fff7ed;border:1px solid #fed7aa;border-radius:6px;">
        <h5 style="margin:0 0 0.5rem 0;color:#9a3412;">Session Report</h5>
        <label style="display:block;font-size:0.85rem;color:#7c2d12;margin-bottom:0.35rem;">Summary (visible to student and college)</label>
        <textarea id="reportSummary-${session.id}" style="width:100%;min-height:72px;padding:0.5rem;border:1px solid #fdba74;border-radius:4px;">${escapeHtml(reportSummary)}</textarea>
        <label style="display:block;font-size:0.85rem;color:#7c2d12;margin:0.55rem 0 0.35rem;">Student Feedback (visible to student and college)</label>
        <textarea id="reportStudent-${session.id}" style="width:100%;min-height:72px;padding:0.5rem;border:1px solid #fdba74;border-radius:4px;">${escapeHtml(reportForStudent)}</textarea>
        <label style="display:block;font-size:0.85rem;color:#7c2d12;margin:0.55rem 0 0.35rem;">Session Mark (visible to college only)</label>
        <input id="reportMark-${session.id}" type="number" min="0" max="100" style="padding:0.5rem;border:1px solid #fdba74;border-radius:4px;width:160px;" value="${session.sessionMark ?? ''}">
        <div style="margin-top:0.6rem;">
          <button class="btn-primary" onclick="submitSessionReport(${session.id})">Generate Report</button>
        </div>
      </div>
    </div>
  `;
}

function openScheduleEditor(sessionId) {
  const editor = document.getElementById(`scheduleEditor-${sessionId}`);
  if (editor) {
    editor.style.display = editor.style.display === 'none' ? 'block' : 'none';
  }
}

async function saveSessionSchedule(sessionId) {
  const dateInput = document.getElementById(`scheduleDate-${sessionId}`);
  const roomInput = document.getElementById(`scheduleRoom-${sessionId}`);

  const scheduleDate = dateInput?.value ? new Date(dateInput.value).toISOString() : null;
  const meetingRoomId = roomInput?.value?.trim();

  if (!scheduleDate || !meetingRoomId) {
    showAlumniScheduleNotification('Please provide both session date and room id.', 'error');
    return;
  }

  try {
    const response = await fetch(`${ALUMNI_API_BASE}/connection-requests/${sessionId}/schedule`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scheduledSessionDate: scheduleDate,
        meetingRoomId,
        meetingProvider: 'INTERNAL_PORTAL'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    showAlumniScheduleNotification('Session schedule saved.', 'success');
    await loadAlumniAcceptedSessions();
  } catch (error) {
    console.error('Failed to save session schedule:', error);
    showAlumniScheduleNotification('Unable to save session schedule.', 'error');
  }
}

async function submitSessionReport(sessionId) {
  const summary = document.getElementById(`reportSummary-${sessionId}`)?.value?.trim() || '';
  const studentReport = document.getElementById(`reportStudent-${sessionId}`)?.value?.trim() || '';
  const markRaw = document.getElementById(`reportMark-${sessionId}`)?.value;
  const sessionMark = markRaw === '' ? null : Number.parseInt(markRaw, 10);

  if (!summary && !studentReport) {
    showAlumniScheduleNotification('Please add report summary or student feedback.', 'error');
    return;
  }

  if (sessionMark !== null && (Number.isNaN(sessionMark) || sessionMark < 0 || sessionMark > 100)) {
    showAlumniScheduleNotification('Mark must be between 0 and 100.', 'error');
    return;
  }

  try {
    const response = await fetch(`${ALUMNI_API_BASE}/connection-requests/${sessionId}/report`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reportSummary: summary,
        reportForStudent: studentReport,
        sessionMark
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    showAlumniScheduleNotification('Report generated and shared with student and college.', 'success');
    await loadAlumniAcceptedSessions();
  } catch (error) {
    console.error('Failed to generate report:', error);
    showAlumniScheduleNotification('Unable to generate report.', 'error');
  }
}

function openPortalVideo(roomId, topic) {
  const modal = document.getElementById('videoPortalModal');
  const frame = document.getElementById('videoPortalFrame');
  const title = document.getElementById('videoPortalTitle');

  if (!modal || !frame) {
    return;
  }

  const safeRoom = encodeURIComponent(roomId || `room-${Date.now()}`);
  frame.src = `https://meet.jit.si/${safeRoom}#config.startWithVideoMuted=false`;
  if (title) {
    title.textContent = `Portal Video Call - ${topic || 'One-on-One Session'}`;
  }
  modal.style.display = 'block';
}

function closePortalVideo() {
  const modal = document.getElementById('videoPortalModal');
  const frame = document.getElementById('videoPortalFrame');

  if (frame) {
    frame.src = '';
  }
  if (modal) {
    modal.style.display = 'none';
  }
}

function showAlumniScheduleNotification(message, type = 'info') {
  const existing = document.querySelector('.notification');
  if (existing) {
    existing.remove();
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

function toDateTimeLocalValue(value) {
  if (!value) {
    return '';
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    return '';
  }

  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
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

function escapeJs(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\"/g, '\\"');
}

window.openScheduleEditor = openScheduleEditor;
window.saveSessionSchedule = saveSessionSchedule;
window.submitSessionReport = submitSessionReport;
window.openPortalVideo = openPortalVideo;
window.closePortalVideo = closePortalVideo;
