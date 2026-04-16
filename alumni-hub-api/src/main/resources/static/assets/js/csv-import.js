/**
 * CSV Import Functionality
 * Handles student/alumni and college CSV file uploads and bulk imports
 */

const API_BASE_URL = 'http://localhost:8081/api';

// DOM Elements
const uploadBox = document.getElementById('uploadBox');
const csvFile = document.getElementById('csvFile');
const filePreview = document.getElementById('filePreview');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const uploadBtn = document.getElementById('uploadBtn');
const cancelBtn = document.getElementById('cancelBtn');
const uploadProgress = document.getElementById('uploadProgress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const resultsSection = document.getElementById('resultsSection');
const downloadTemplate = document.getElementById('downloadTemplate');
const importAgainBtn = document.getElementById('importAgainBtn');
const viewDataBtn = document.getElementById('viewDataBtn');
const typeButtons = document.querySelectorAll('.type-btn');

let selectedFile = null;
let currentImportType = 'students'; // 'students' or 'colleges'

// ============================================
// AUTHENTICATION CHECK
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  const currentUser = localStorage.getItem('currentUser');
  
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  const user = JSON.parse(currentUser);
  
  // Only college admins can access this page
  if (user.role !== 'college') {
    alert('Only college administrators can access this page');
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('userRole').textContent = `${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`;
  document.getElementById('dashboardLink').href = `college/dashboard.html`;

  // Setup import type switcher
  setupImportTypeSwitcher();
});

// ============================================
// IMPORT TYPE SWITCHER
// ============================================

function setupImportTypeSwitcher() {
  typeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      typeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentImportType = btn.dataset.type;
      
      // Update format tables
      if (currentImportType === 'students') {
        document.getElementById('studentsFormatTable').style.display = 'table';
        document.getElementById('collegesFormatTable').style.display = 'none';
      } else {
        document.getElementById('studentsFormatTable').style.display = 'none';
        document.getElementById('collegesFormatTable').style.display = 'table';
      }
    });
  });
}

// ============================================
// FILE SELECTION
// ============================================

// Click to select file
uploadBox.addEventListener('click', () => csvFile.click());

// File input change
csvFile.addEventListener('change', handleFileSelect);

// Drag and drop
uploadBox.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadBox.classList.add('dragging');
});

uploadBox.addEventListener('dragleave', () => {
  uploadBox.classList.remove('dragging');
});

uploadBox.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadBox.classList.remove('dragging');
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    csvFile.files = files;
    handleFileSelect();
  }
});

/**
 * Handle file selection
 */
function handleFileSelect() {
  const file = csvFile.files[0];
  
  if (!file) return;

  const validExtensions = ['.csv', '.xlsx', '.xls'];
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  
  if (!validExtensions.includes(fileExtension)) {
    showNotification('Please select a valid CSV or Excel file (.csv, .xlsx, .xls)', 'error');
    return;
  }

  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    showNotification('File size must be less than 5MB', 'error');
    return;
  }

  selectedFile = file;
  
  // Show file preview
  fileName.textContent = `📄 ${file.name}`;
  fileSize.textContent = `${(file.size / 1024).toFixed(2)} KB`;
  filePreview.classList.remove('hidden');
  uploadBox.classList.add('hidden');
}

/**
 * Cancel file selection
 */
cancelBtn.addEventListener('click', () => {
  selectedFile = null;
  csvFile.value = '';
  filePreview.classList.add('hidden');
  uploadBox.classList.remove('hidden');
  resultsSection.classList.add('hidden');
});

// ============================================
// FILE UPLOAD
// ============================================

/**
 * Upload CSV or Excel file
 */
uploadBtn.addEventListener('click', async () => {
  if (!selectedFile) {
    showNotification('Please select a file', 'error');
    return;
  }

  // Prepare form data
  const formData = new FormData();
  formData.append('file', selectedFile);

  // Show progress
  uploadProgress.classList.remove('hidden');
  uploadBtn.disabled = true;
  cancelBtn.disabled = true;
  filePreview.classList.add('hidden');

  try {
    // Simulate upload progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      if (progress < 90) {
        progress += Math.random() * 30;
        updateProgress(progress);
      }
    }, 200);

    // Determine endpoint based on import type
    const endpoint = currentImportType === 'students' ? '/students/import/csv' : '/colleges/import/csv';
    
    // Upload file
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: formData
    });

    clearInterval(progressInterval);
    updateProgress(100);

    const data = await response.json();

    // Hide progress after a short delay
    setTimeout(() => {
      uploadProgress.classList.add('hidden');
      
      if (response.ok && data.success) {
        displayResults(data);
      } else {
        showNotification(data.error || 'Import failed', 'error');
        resetUpload();
      }
    }, 1000);

  } catch (error) {
    console.error('Upload error:', error);
    showNotification('Upload failed: ' + error.message, 'error');
    uploadProgress.classList.add('hidden');
    resetUpload();
  }
});

/**
 * Update progress bar
 */
function updateProgress(percent) {
  const p = Math.min(percent, 100);
  progressFill.style.width = p + '%';
  progressText.textContent = `Uploading: ${Math.round(p)}%`;
}

// ============================================
// RESULTS DISPLAY
// ============================================

/**
 * Display import results
 */
function displayResults(data) {
  const importedCount = data.importedCount || 0;
  const totalRows = data.totalRows || 0;
  const errors = data.errors || [];
  const items = currentImportType === 'students' ? (data.students || []) : (data.colleges || []);

  // Update stats
  document.getElementById('importedCount').textContent = importedCount;
  document.getElementById('totalRows').textContent = totalRows;
  document.getElementById('errorCount').textContent = errors.length;

  // Show/hide error box
  const errorBox = document.getElementById('errorBox');
  if (errors.length > 0) {
    errorBox.classList.remove('hidden');
  } else {
    errorBox.classList.add('hidden');
  }

  // Display imported data
  if (items.length > 0) {
    const tableBody = document.getElementById('importedTableBody');
    const tableHead = document.getElementById('tableHead');
    tableBody.innerHTML = '';
    tableHead.innerHTML = '';

    // Set title
    const importedListTitle = document.getElementById('importedListTitle');
    if (currentImportType === 'students') {
      importedListTitle.textContent = '✅ Successfully Imported Students';
      // Create headers for students
      tableHead.innerHTML = `
        <tr>
          <th>Reg. No</th>
          <th>Name</th>
          <th>College Email</th>
          <th>Department</th>
          <th>CGPA</th>
        </tr>
      `;
      // Create rows for students
      items.forEach(student => {
        const row = `
          <tr>
            <td>${student.registrationNumber || '-'}</td>
            <td>${student.name || '-'}</td>
            <td>${student.collegeEmail || '-'}</td>
            <td>${student.department || '-'}</td>
            <td>${student.cgpa ? student.cgpa.toFixed(2) : '-'}</td>
          </tr>
        `;
        tableBody.innerHTML += row;
      });
    } else {
      importedListTitle.textContent = '✅ Successfully Imported Colleges';
      // Create headers for colleges
      tableHead.innerHTML = `
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Location</th>
          <th>Contact</th>
        </tr>
      `;
      // Create rows for colleges
      items.forEach(college => {
        const row = `
          <tr>
            <td>${college.name || '-'}</td>
            <td>${college.email || '-'}</td>
            <td>${college.location || '-'}</td>
            <td>${college.contactNumber || '-'}</td>
          </tr>
        `;
        tableBody.innerHTML += row;
      });
    }

    document.getElementById('importedList').classList.remove('hidden');
  } else {
    document.getElementById('importedList').classList.add('hidden');
  }

  // Display errors
  if (errors.length > 0) {
    const errorMessages = document.getElementById('errorMessages');
    errorMessages.innerHTML = '';

    errors.forEach(error => {
      const errorHTML = `<div class="error-message">${error}</div>`;
      errorMessages.innerHTML += errorHTML;
    });

    document.getElementById('errorsList').classList.remove('hidden');
  } else {
    document.getElementById('errorsList').classList.add('hidden');
  }

  // Show results section
  resultsSection.classList.remove('hidden');
  uploadBtn.disabled = false;
  cancelBtn.disabled = false;

  // Show success message
  if (importedCount > 0) {
    const itemType = currentImportType === 'students' ? 'students' : 'colleges';
    showNotification(`Successfully imported ${importedCount} ${itemType}! 🎉`, 'success');
  }
}

// ============================================
// ACTION BUTTONS
// ============================================

/**
 * Import another file
 */
importAgainBtn.addEventListener('click', () => {
  selectedFile = null;
  csvFile.value = '';
  filePreview.classList.remove('hidden');
  uploadBox.classList.remove('hidden');
  resultsSection.classList.add('hidden');
});

/**
 * View all data
 */
viewDataBtn.addEventListener('click', () => {
  if (currentImportType === 'students') {
    window.location.href = 'student/dashboard.html';
  } else {
    window.location.href = 'college/dashboard.html';
  }
});

// ============================================
// DOWNLOAD TEMPLATE
// ============================================

/**
 * Download CSV or Excel template
 */
downloadTemplate.addEventListener('click', (e) => {
  e.preventDefault();
  
  let templateData;
  let filename;

  if (currentImportType === 'students') {
    templateData = [
      ['Reg. No', 'Name', 'Career Path', 'SIET LMS Portal Levels Completion', 'Degree', 'Department', 'Gender', '10th %', '12th %', 'CGPA', 'Standing Arrears', 'History Arrears', 'College Email', 'Personal Email', 'Mobile', 'Whatsapp', 'Technical Languages', 'Certifications', 'Achievements', 'Other Languages', 'Full Address', 'City', 'State', 'Aadhar', 'PAN'],
      ['7140', 'John Doe A', 'Software Developer', 'Advanced', 'B.Tech', 'Computer Science', 'Male', '92.5', '95.0', '8.5', '0', '0', 'john.doe@sriShakthi.ac.in', 'john.doe@gmail.com', '+91-9876543210', '+91-9876543210', 'Java, Python, JavaScript', 'JCP', 'Won Hackathon 2023 - ₹50,000', 'Tamil, Hindi', '123 Main St, Chennai', 'Chennai', 'Tamil Nadu', 'XXXX-XXXX-1234', 'ABCDE1234F'],
      ['7141', 'Jane Smith B', 'Full Stack Developer', 'Intermediate', 'B.Tech', 'IT', 'Female', '95.0', '97.0', '9.0', '0', '0', 'jane.smith@sriShakthi.ac.in', 'jane.smith@gmail.com', '+91-9876543211', '+91-9876543211', 'React, Node.js, Python', 'CCNA', 'Academic Excellence Award', 'English, Tamil', '456 Oak Ave, Chennai', 'Chennai', 'Tamil Nadu', 'XXXX-XXXX-5678', 'CDEFG5678H']
    ];
    filename = 'students_template.xlsx';
  } else {
    templateData = [
      ['name', 'email', 'location', 'contactNumber', 'description'],
      ['MIT', 'contact@mit.edu', 'Cambridge MA', '+1-617-253-4791', 'Leading research university'],
      ['Stanford', 'admissions@stanford.edu', 'Stanford CA', '+1-650-723-2300', 'Top-tier research institution'],
      ['Harvard', 'admissions@harvard.edu', 'Cambridge MA', '+1-617-495-1551', 'Ivy League university'],
      ['Berkeley', 'admissions@berkeley.edu', 'Berkeley CA', '+1-510-642-4000', 'World-class public university'],
      ['Carnegie Mellon', 'admissions@cmu.edu', 'Pittsburgh PA', '+1-412-268-2082', 'Technology and research focused']
    ];
    filename = 'colleges_template.xlsx';
  }

  // Create Excel file using SheetJS
  const worksheet = XLSX.utils.aoa_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  const sheetName = currentImportType === 'students' ? 'Students' : 'Colleges';
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename);
  
  showNotification(`${currentImportType === 'students' ? 'Student' : 'College'} template downloaded!`, 'success');
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Reset upload interface
 */
function resetUpload() {
  uploadBtn.disabled = false;
  cancelBtn.disabled = false;
  filePreview.classList.add('hidden');
  uploadBox.classList.remove('hidden');
}

/**
 * Show notification
 */
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
    padding: 15px 20px;
    background: ${type === 'success' ? '#2d7e3d' : type === 'error' ? '#c41c3b' : '#0066cc'};
    color: white;
    border-radius: 4px;
    z-index: 9999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    font-weight: 500;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 4000);
}

/**
 * Logout user
 */
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}
