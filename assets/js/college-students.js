/**
 * College Students Page
 * Loads imported students from backend and renders searchable table.
 */

const API_BASE_URL = 'http://localhost:8081/api';

const studentsTableBody = document.getElementById('studentsTableBody');
const studentsCountText = document.getElementById('studentsCountText');
const studentSearch = document.getElementById('studentSearch');
const batchFilter = document.getElementById('batchFilter');
const branchFilter = document.getElementById('branchFilter');
const userRole = document.getElementById('userRole');
const studentProfileModal = document.getElementById('studentProfileModal');
const studentProfileBody = document.getElementById('studentProfileBody');
const studentProfileTitle = document.getElementById('studentProfileTitle');
const closeStudentProfileBtn = document.getElementById('closeStudentProfileBtn');

let allStudents = [];

document.addEventListener('DOMContentLoaded', async () => {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    window.location.href = '../login.html';
    return;
  }

  const user = JSON.parse(currentUser);
  if ((user.role || '').toLowerCase() !== 'college') {
    alert('Only college administrators can access this page');
    window.location.href = '../index.html';
    return;
  }

  if (userRole) {
    userRole.textContent = `${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`;
  }

  await loadStudents();
  wireFilters();
  wireProfileModal();
});

async function loadStudents() {
  try {
    const response = await fetch(`${API_BASE_URL}/students`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    allStudents = await response.json();
    renderStudents(allStudents);
  } catch (error) {
    studentsTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#c41c3b;">Failed to load students from DB</td></tr>';
    console.error('Failed to load students:', error);
  }
}

function wireFilters() {
  if (studentSearch) {
    studentSearch.addEventListener('input', applyFilters);
  }
  if (batchFilter) {
    batchFilter.addEventListener('change', applyFilters);
  }
  if (branchFilter) {
    branchFilter.addEventListener('change', applyFilters);
  }
}

function applyFilters() {
  const q = (studentSearch?.value || '').toLowerCase().trim();
  const selectedBatch = batchFilter?.value || 'All Batches';
  const selectedBranch = branchFilter?.value || 'All Branches';

  const filtered = allStudents.filter((s) => {
    const regNo = (s.registrationNumber || s.enrollmentNumber || '').toLowerCase();
    const name = (s.name || '').toLowerCase();
    const email = (s.collegeEmail || s.email || '').toLowerCase();
    const dept = (s.department || '').toLowerCase();
    const batch = inferBatch(s);

    const searchOk = !q || name.includes(q) || regNo.includes(q) || email.includes(q);
    const batchOk = selectedBatch === 'All Batches' || batch === selectedBatch;
    const branchOk = selectedBranch === 'All Branches' || dept === selectedBranch.toLowerCase();

    return searchOk && batchOk && branchOk;
  });

  renderStudents(filtered);
}

function inferBatch(student) {
  const reg = student.registrationNumber || student.enrollmentNumber || '';
  const match = String(reg).match(/(20\d{2})/);
  return match ? match[1] : 'N/A';
}

function renderStudents(students) {
  studentsCountText.textContent = `Active Students (${students.length})`;

  if (!students || students.length === 0) {
    studentsTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#888;">No students found</td></tr>';
    return;
  }

  studentsTableBody.innerHTML = students.map((s) => {
    const roll = s.registrationNumber || s.enrollmentNumber || '-';
    const email = s.collegeEmail || s.email || '-';
    const department = s.department || '-';
    const degree = s.degree || '-';

    return `
      <tr>
        <td>${escapeHtml(s.name || '-')}</td>
        <td>${escapeHtml(roll)}</td>
        <td>${escapeHtml(email)}</td>
        <td>${escapeHtml(department)}</td>
        <td>${escapeHtml(degree)}</td>
        <td><span class="status confirmed">Active</span></td>
        <td><button class="btn-outline-small" style="font-size:0.75rem;" onclick="viewProfile(${s.id})">View Profile</button></td>
      </tr>
    `;
  }).join('');
}

function wireProfileModal() {
  if (closeStudentProfileBtn) {
    closeStudentProfileBtn.addEventListener('click', closeProfileModal);
  }

  if (studentProfileModal) {
    studentProfileModal.addEventListener('click', (event) => {
      if (event.target === studentProfileModal) {
        closeProfileModal();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeProfileModal();
    }
  });
}

function viewProfile(studentId) {
  const student = allStudents.find((item) => item.id === studentId);
  if (!student || !studentProfileModal || !studentProfileBody) {
    return;
  }

  if (studentProfileTitle) {
    studentProfileTitle.textContent = `${student.name || 'Student'} - Full Profile`;
  }

  studentProfileBody.innerHTML = `
    <div class="profile-grid">
      ${renderProfileItem('Registration No', student.registrationNumber)}
      ${renderProfileItem('Enrollment No', student.enrollmentNumber)}
      ${renderProfileItem('College Email', student.collegeEmail || student.email)}
      ${renderProfileItem('Personal Email', student.personalEmail)}
      ${renderProfileItem('Mobile Number', student.mobileNumber)}
      ${renderProfileItem('Whatsapp Number', student.whatsappNumber)}
      ${renderProfileItem('Gender', student.gender)}
      ${renderProfileItem('Degree', student.degree)}
      ${renderProfileItem('Department', student.department)}
      ${renderProfileItem('Career Path', student.careerPath)}
      ${renderProfileItem('LMS Completion', student.lmsPortalLevelCompletion)}
      ${renderProfileItem('10th Percentage', asText(student.tenthPercentage))}
      ${renderProfileItem('12th/Diploma Percentage', asText(student.twelfthDiplomaPercentage))}
      ${renderProfileItem('CGPA', asText(student.cgpa))}
      ${renderProfileItem('Standing Arrears', asText(student.standingArrearsCount))}
      ${renderProfileItem('History Arrears', asText(student.historyArrearsCount))}
      ${renderProfileItem('Technical Languages', student.technicalLanguagesKnown)}
      ${renderProfileItem('Certifications', student.certificationsCompleted)}
      ${renderProfileItem('Achievements History', student.achievements)}
      ${renderProfileItem('Other Languages', student.otherCommunicationLanguages)}
      ${renderProfileItem('Full Address', student.fullAddress)}
      ${renderProfileItem('City', student.city)}
      ${renderProfileItem('State', student.state)}
      ${renderProfileItem('Aadhar Number', student.aadharNumber)}
      ${renderProfileItem('PAN Number', student.panNumber)}
      ${renderProfileItem('Created At', formatDateTime(student.createdAt))}
      ${renderProfileItem('Updated At', formatDateTime(student.updatedAt))}
    </div>
  `;

  studentProfileModal.classList.add('active');
}

function closeProfileModal() {
  if (studentProfileModal) {
    studentProfileModal.classList.remove('active');
  }
}

function renderProfileItem(label, value) {
  return `
    <div class="profile-item">
      <span class="profile-item-label">${escapeHtml(label)}</span>
      <span class="profile-item-value">${escapeHtml(asText(value))}</span>
    </div>
  `;
}

function asText(value) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  return String(value);
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
