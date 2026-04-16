/**
 * Auto-Generate Student Credentials
 * Creates student login accounts from imported student records.
 */

const API_BASE_URL = 'http://localhost:8081/api';

const generateTab = document.getElementById('generateTab');
const manageTab = document.getElementById('manageTab');
const tabButtons = document.querySelectorAll('.tab-btn');
const collegesTableBody = document.getElementById('collegesTableBody');
const manageTableBody = document.getElementById('manageTableBody');
const selectAllCheckbox = document.getElementById('selectAll');
const generateBtn = document.getElementById('generateBtn');
const resetBtn = document.getElementById('resetBtn');
const confirmBtn = document.getElementById('confirmBtn');
const downloadCsvBtn = document.getElementById('downloadCsvBtn');
const cancelBtn = document.getElementById('cancelBtn');
const credentialsPreview = document.getElementById('credentialsPreview');
const credentialsList = document.getElementById('credentialsList');
const collegeSearch = document.getElementById('collegeSearch');
const statusFilter = document.getElementById('statusFilter');
const passwordLength = document.getElementById('passwordLength');
const passwordLengthDisplay = document.getElementById('passwordLengthDisplay');
const modal = document.getElementById('credentialModal');
const closeModal = document.querySelector('.close');

let students = [];
let studentUsers = [];
let selectedCredentials = [];

// ============================================
// AUTHENTICATION CHECK
// ============================================

document.addEventListener('DOMContentLoaded', async function() {
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

  document.getElementById('userRole').textContent = `${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`;

  await Promise.all([loadStudents(), loadStudentUsers()]);
  displayStudents(students);
});

// ============================================
// TAB NAVIGATION
// ============================================

tabButtons.forEach(btn => {
  btn.addEventListener('click', function() {
    const tabName = this.getAttribute('data-tab');

    tabButtons.forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.remove('active');
    });

    if (tabName === 'generate') {
      generateTab.classList.add('active');
    } else {
      manageTab.classList.add('active');
      loadManagedStudents();
    }
  });
});

// ============================================
// LOAD DATA
// ============================================

async function loadStudents() {
  try {
    const response = await fetch(`${API_BASE_URL}/students`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    students = await response.json();
  } catch (error) {
    console.error('Error loading students:', error);
    students = [];
    showNotification('Failed to load students', 'error');
  }
}

async function loadStudentUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}/users/role/student`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    studentUsers = await response.json();
  } catch (error) {
    console.error('Error loading student users:', error);
    studentUsers = [];
  }
}

function hasCredentials(email) {
  return studentUsers.some(u => (u.email || '').toLowerCase() === (email || '').toLowerCase());
}

// ============================================
// DISPLAY
// ============================================

function displayStudents(data) {
  collegesTableBody.innerHTML = '';

  if (!data || data.length === 0) {
    collegesTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">No imported students found</td></tr>';
    return;
  }

  data.forEach(student => {
    const email = student.collegeEmail || student.email || '';
    const alreadyHasCredentials = hasCredentials(email);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="checkbox" data-college-id="${student.id}" data-college-name="${escapeHtml(student.name || 'Student')}" data-college-email="${escapeHtml(email)}" ${alreadyHasCredentials ? 'disabled' : ''}></td>
      <td>${escapeHtml(student.name || '-')}</td>
      <td>${escapeHtml(email || '-')}</td>
      <td><span class="status-badge ${alreadyHasCredentials ? 'with-creds' : 'without-creds'}">${alreadyHasCredentials ? 'With Credentials' : 'Without Credentials'}</span></td>
    `;
    collegesTableBody.appendChild(row);
  });

  document.querySelectorAll('input[type="checkbox"][data-college-id]').forEach(checkbox => {
    checkbox.addEventListener('change', updateSelectAll);
  });

  updateGenerateButton();
}

async function loadManagedStudents() {
  await loadStudentUsers();
  manageTableBody.innerHTML = '';

  if (!studentUsers || studentUsers.length === 0) {
    manageTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">No student credentials generated yet</td></tr>';
    return;
  }

  studentUsers.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${escapeHtml(user.name || '-')}</td>
      <td>${escapeHtml(user.email || '-')}</td>
      <td>${escapeHtml((user.email || '').split('@')[0] || '-')}</td>
      <td>${formatDate(user.createdAt)}</td>
      <td>
        <button class="btn-outline-small" onclick="viewCredentials(${user.id}, '${escapeJs(user.name || 'Student')}', '${escapeJs(user.email || '')}')">View</button>
      </td>
    `;
    manageTableBody.appendChild(row);
  });
}

// ============================================
// CHECKBOX MANAGEMENT
// ============================================

selectAllCheckbox.addEventListener('change', function() {
  document.querySelectorAll('input[type="checkbox"][data-college-id]').forEach(checkbox => {
    if (!checkbox.disabled) {
      checkbox.checked = this.checked;
    }
  });
  updateGenerateButton();
});

function updateSelectAll() {
  const enabled = Array.from(document.querySelectorAll('input[type="checkbox"][data-college-id]')).filter(c => !c.disabled);
  const checkedCount = enabled.filter(c => c.checked).length;
  selectAllCheckbox.checked = enabled.length > 0 && checkedCount === enabled.length;
  updateGenerateButton();
}

function updateGenerateButton() {
  const selectedCount = document.querySelectorAll('input[type="checkbox"][data-college-id]:checked').length;
  generateBtn.disabled = selectedCount === 0;
  generateBtn.textContent = `🔑 Generate Credentials (${selectedCount})`;
}

// ============================================
// CREDENTIAL GENERATION
// ============================================

passwordLength.addEventListener('input', function() {
  passwordLengthDisplay.textContent = this.value;
});

generateBtn.addEventListener('click', () => {
  const selectedStudents = document.querySelectorAll('input[type="checkbox"][data-college-id]:checked');
  selectedCredentials = [];

  selectedStudents.forEach(checkbox => {
    const studentId = checkbox.dataset.collegeId;
    const studentName = checkbox.dataset.collegeName;
    const studentEmail = checkbox.dataset.collegeEmail;

    const credentials = generateCredentials(studentName, studentEmail);
    selectedCredentials.push({
      studentId,
      studentName,
      studentEmail,
      ...credentials
    });
  });

  displayCredentialsPreview();
});

function generateCredentials(studentName, studentEmail) {
  const passwordLen = parseInt(passwordLength.value, 10);
  const includeSpecial = document.getElementById('includeSpecial').checked;
  const includeNumbers = document.getElementById('includeNumbers').checked;

  const username = (studentEmail || '').split('@')[0] || (studentName || 'student').toLowerCase().replace(/\s+/g, '');
  const password = generatePassword(passwordLen, includeSpecial, includeNumbers);

  return {
    username,
    password,
    email: studentEmail
  };
}

function generatePassword(length = 12, special = true, numbers = true) {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const specialChars = '!@#$%^&*';

  let chars = lowercase + uppercase;
  if (numbers) chars += digits;
  if (special) chars += specialChars;

  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
}

function displayCredentialsPreview() {
  credentialsList.innerHTML = '';

  selectedCredentials.forEach(cred => {
    const item = document.createElement('div');
    item.className = 'credential-item';
    item.innerHTML = `
      <div class="credential-item-info">
        <div class="credential-item-label">Student</div>
        <div class="credential-item-value">${escapeHtml(cred.studentName)}</div>
      </div>
      <div class="credential-item-info">
        <div class="credential-item-label">Username</div>
        <div class="credential-item-value">${escapeHtml(cred.username)}</div>
      </div>
      <button class="copy-btn" onclick="copyToClipboard('${escapeJs(cred.username)}')">Copy</button>
    `;
    credentialsList.appendChild(item);

    const passItem = document.createElement('div');
    passItem.className = 'credential-item';
    passItem.innerHTML = `
      <div class="credential-item-info">
        <div class="credential-item-label">Password</div>
        <div class="credential-item-password">${escapeHtml(cred.password)}</div>
      </div>
      <button class="copy-btn" onclick="copyToClipboard('${escapeJs(cred.password)}')">Copy</button>
    `;
    credentialsList.appendChild(passItem);
  });

  credentialsPreview.classList.remove('hidden');
}

// ============================================
// ACTION BUTTONS
// ============================================

confirmBtn.addEventListener('click', async () => {
  if (selectedCredentials.length === 0) {
    showNotification('No credentials selected', 'warning');
    return;
  }

  let created = 0;
  let existing = 0;
  let failed = 0;

  for (const cred of selectedCredentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: cred.studentName,
          email: cred.studentEmail,
          password: cred.password,
          role: 'student'
        })
      });

      if (response.ok) {
        created++;
      } else if (response.status === 409) {
        existing++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error('Credential creation failed for', cred.studentEmail, error);
      failed++;
    }
  }

  await loadStudentUsers();
  displayStudents(students);

  showNotification(`Credentials result: Created ${created}, Existing ${existing}, Failed ${failed}`, failed > 0 ? 'warning' : 'success');

  const saved = JSON.parse(localStorage.getItem('generatedStudentCredentials') || '[]');
  localStorage.setItem('generatedStudentCredentials', JSON.stringify([...saved, ...selectedCredentials]));

  setTimeout(() => {
    resetCredentialForm();
  }, 1200);
});

downloadCsvBtn.addEventListener('click', () => {
  let csv = 'Student Name,Email,Username,Password\n';

  selectedCredentials.forEach(cred => {
    csv += `"${cred.studentName}","${cred.studentEmail}","${cred.username}","${cred.password}"\n`;
  });

  downloadCSV(csv, 'student_credentials.csv');
  showNotification('Credentials downloaded as CSV!', 'success');
});

cancelBtn.addEventListener('click', resetCredentialForm);

function resetCredentialForm() {
  selectedCredentials = [];
  credentialsPreview.classList.add('hidden');
  document.querySelectorAll('input[type="checkbox"][data-college-id]').forEach(checkbox => {
    checkbox.checked = false;
  });
  selectAllCheckbox.checked = false;
  updateGenerateButton();
}

resetBtn.addEventListener('click', resetCredentialForm);

// ============================================
// SEARCH & FILTER
// ============================================

collegeSearch.addEventListener('input', function() {
  applyFilters();
});

statusFilter.addEventListener('change', function() {
  applyFilters();
});

function applyFilters() {
  const searchTerm = (collegeSearch.value || '').toLowerCase().trim();
  const mode = statusFilter.value;

  const filtered = students.filter(student => {
    const name = (student.name || '').toLowerCase();
    const email = (student.collegeEmail || student.email || '').toLowerCase();
    const hasCred = hasCredentials(student.collegeEmail || student.email || '');

    const searchOk = !searchTerm || name.includes(searchTerm) || email.includes(searchTerm);
    const statusOk = mode === 'all' || (mode === 'with-creds' && hasCred) || (mode === 'without-creds' && !hasCred);

    return searchOk && statusOk;
  });

  displayStudents(filtered);
}

// ============================================
// MODAL
// ============================================

function viewCredentials(studentId, studentName, studentEmail) {
  modal.classList.add('active');
  document.getElementById('modalTitle').textContent = `Credentials - ${studentName}`;

  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = `
    <div class="credential-detail-row">
      <span class="detail-label">Email:</span>
      <span class="detail-value">${escapeHtml(studentEmail)}</span>
    </div>
    <div class="credential-detail-row">
      <span class="detail-label">Username:</span>
      <span class="detail-value">${escapeHtml((studentEmail || '').split('@')[0])}</span>
    </div>
    <div class="credential-detail-row">
      <span class="detail-label">Status:</span>
      <span class="detail-value">Credential account active</span>
    </div>
  `;
}

closeModal.addEventListener('click', () => {
  modal.classList.remove('active');
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
  }
});

// ============================================
// UTILS
// ============================================

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Copied!', 'success');
  });
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
    background: ${type === 'success' ? '#2d7e3d' : type === 'error' ? '#c41c3b' : type === 'warning' ? '#cc7a00' : '#0066cc'};
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

function formatDate(value) {
  if (!value) {
    return '-';
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    return '-';
  }
  return d.toLocaleDateString('en-IN');
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

function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = '../login.html';
}
