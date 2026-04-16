/**
 * College session reports: view alumni reports and marks (marks only for college).
 */

const COLLEGE_REPORTS_API_BASE = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:8081/api';

let collegeReportsUser = null;
let collegeReportsStudents = [];
let collegeReportsAlumni = [];

document.addEventListener('DOMContentLoaded', async () => {
  const rawUser = localStorage.getItem('currentUser');
  if (!rawUser) {
    return;
  }

  collegeReportsUser = JSON.parse(rawUser);
  if ((collegeReportsUser.role || '').toLowerCase() !== 'college') {
    return;
  }

  await Promise.all([loadReferenceData(), loadCollegeReports()]);
});

async function loadReferenceData() {
  try {
    collegeReportsStudents = await StudentService.getAllStudents();
  } catch (error) {
    collegeReportsStudents = [];
  }

  try {
    collegeReportsAlumni = await AlumniService.getAllAlumni();
  } catch (error) {
    collegeReportsAlumni = [];
  }
}

async function loadCollegeReports() {
  const tableBody = document.getElementById('collegeReportTableBody');
  if (!tableBody) {
    return;
  }

  try {
    const response = await fetch(`${COLLEGE_REPORTS_API_BASE}/connection-requests/college/${collegeReportsUser.id}/reports`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const reports = await response.json();
    if (!reports.length) {
      tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#888;">No reports generated yet</td></tr>';
      return;
    }

    tableBody.innerHTML = reports
      .sort((a, b) => new Date(b.reportGeneratedAt || 0) - new Date(a.reportGeneratedAt || 0))
      .map((report) => renderCollegeReportRow(report))
      .join('');
  } catch (error) {
    console.error('Failed loading college reports:', error);
    tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#b91c1c;">Failed to load reports</td></tr>';
  }
}

function renderCollegeReportRow(report) {
  const student = collegeReportsStudents.find((item) => item.id === report.studentId);
  const alumni = collegeReportsAlumni.find((item) => item.id === report.alumniId);

  return `
    <tr>
      <td>${escapeHtml(formatDateTime(report.reportGeneratedAt))}</td>
      <td>${escapeHtml(student?.name || `Student #${report.studentId || '-'}`)}</td>
      <td>${escapeHtml(alumni?.name || `Alumni #${report.alumniId || '-'}`)}</td>
      <td>${escapeHtml(report.topic || '-')}</td>
      <td>${escapeHtml(report.reportSummary || '-')}</td>
      <td>${escapeHtml(report.reportForStudent || '-')}</td>
      <td><strong>${report.sessionMark ?? '-'}</strong></td>
      <td>${escapeHtml(report.meetingRoomId || '-')}</td>
    </tr>
  `;
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
