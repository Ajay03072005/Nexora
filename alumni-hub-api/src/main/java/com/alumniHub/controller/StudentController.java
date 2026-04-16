package com.alumniHub.controller;

import com.alumniHub.entity.Student;
import com.alumniHub.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.NestedExceptionUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentService studentService;

    // Get all students
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    // Get student by ID
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Optional<Student> student = studentService.getStudentById(id);
        return student.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get student by email
    @GetMapping("/email/{email}")
    public ResponseEntity<Student> getStudentByEmail(@PathVariable String email) {
        Optional<Student> student = studentService.getStudentByEmail(email);
        return student.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create new student
    @PostMapping
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        Student newStudent = studentService.createStudent(student);
        return ResponseEntity.status(HttpStatus.CREATED).body(newStudent);
    }

    // Update student
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody Student studentDetails) {
        Student updatedStudent = studentService.updateStudent(id, studentDetails);
        if (updatedStudent != null) {
            return ResponseEntity.ok(updatedStudent);
        }
        return ResponseEntity.notFound().build();
    }

    // Delete student
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Import students from CSV or Excel file
     * Supported formats: .csv, .xlsx, .xls
     */
    @PostMapping("/import/csv")
    public ResponseEntity<?> importStudentsFromCSV(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "File is empty");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            String filename = file.getOriginalFilename();
            if (filename == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid file name");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            String lowercaseFilename = filename.toLowerCase();
            List<Student> students = new ArrayList<>();
            List<String> errors = new ArrayList<>();

            // Determine file type and process accordingly
            if (lowercaseFilename.endsWith(".csv")) {
                processCSVFile(file, students, errors);
            } else if (lowercaseFilename.endsWith(".xlsx") || lowercaseFilename.endsWith(".xls")) {
                processExcelFile(file, students, errors);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "File must be a CSV or Excel file (.csv, .xlsx, .xls)");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            // Save all valid students
            List<Student> savedStudents = new ArrayList<>();
            for (Student student : students) {
                try {
                    savedStudents.add(studentService.createStudent(student));
                } catch (DataIntegrityViolationException e) {
                    errors.add("Error saving student " + student.getName() + ": " + getRootCauseMessage(e));
                } catch (Exception e) {
                    errors.add("Error saving student " + student.getName() + ": " + getRootCauseMessage(e));
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("totalRows", students.size() + errors.size());
            response.put("importedCount", savedStudents.size());
            response.put("errors", errors);
            response.put("students", savedStudents);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to process file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Process CSV file
     */
    private void processCSVFile(MultipartFile file, List<Student> students, List<String> errors) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            int rowNumber = 0;
            ColumnMapping mapping = null;

            while ((line = reader.readLine()) != null) {
                rowNumber++;

                if (line.trim().isEmpty()) {
                    continue;
                }

                String[] values = line.split(",", -1);
                if (mapping == null) {
                    mapping = buildColumnMapping(values);
                    continue;
                }

                processRow(values, rowNumber, students, errors, mapping);
            }
        } catch (Exception e) {
            errors.add("Error reading CSV file: " + e.getMessage());
        }
    }

    /**
     * Process Excel file
     */
    private void processExcelFile(MultipartFile file, List<Student> students, List<String> errors) {
        try {
            Workbook workbook;
            String originalFilename = file.getOriginalFilename();
            if (originalFilename != null && originalFilename.toLowerCase().endsWith(".xlsx")) {
                workbook = new XSSFWorkbook(file.getInputStream());
            } else {
                workbook = new HSSFWorkbook(file.getInputStream());
            }

            Sheet sheet = workbook.getSheetAt(0);
            int rowNumber = 0;
            ColumnMapping mapping = null;

            for (Row row : sheet) {
                rowNumber++;

                // Skip empty rows (all cells are empty)
                if (row.getPhysicalNumberOfCells() == 0) {
                    continue;
                }
                
                // Check if row is essentially empty (all cells have no content)
                boolean hasContent = false;
                for (int i = 0; i < Math.min(2, row.getLastCellNum()); i++) {
                    Cell cell = row.getCell(i);
                    if (cell != null && !getCellValueAsString(cell).isEmpty()) {
                        hasContent = true;
                        break;
                    }
                }
                if (!hasContent) {
                    continue;
                }

                String[] values = new String[30]; // Support up to 30 columns
                for (int i = 0; i < 30; i++) {
                    values[i] = "";
                }
                
                for (int i = 0; i < Math.min(30, row.getLastCellNum()); i++) {
                    Cell cell = row.getCell(i);
                    if (cell != null) {
                        values[i] = getCellValueAsString(cell);
                    }
                }

                if (mapping == null) {
                    mapping = buildColumnMapping(values);
                    continue;
                }

                processRow(values, rowNumber, students, errors, mapping);
            }

            workbook.close();
        } catch (Exception e) {
            errors.add("Error reading Excel file: " + e.getMessage());
        }
    }

    /**
     * Process a data row from CSV or Excel
     */
    private void processRow(String[] values, int rowNumber, List<Student> students, List<String> errors, ColumnMapping mapping) {
        try {
            // Skip rows with missing or incomplete data (less than 2 essential columns)
            if (values == null || values.length < 2) {
                return; // Skip empty/invalid rows silently
            }
            
            // Extract all fields using detected column mapping. Extra columns (e.g., LinkedIn) are ignored.
            String regNo = safeGetValue(values, mapping.regNoIndex);
            String name = safeGetValue(values, mapping.nameIndex);
            String careerPath = safeGetValue(values, mapping.careerPathIndex);
            String lmsPortal = safeGetValue(values, mapping.lmsPortalIndex);
            String degree = safeGetValue(values, mapping.degreeIndex);
            String department = safeGetValue(values, mapping.departmentIndex);
            String gender = safeGetValue(values, mapping.genderIndex);
            String tenthStr = safeGetValue(values, mapping.tenthIndex);
            String twelfthStr = safeGetValue(values, mapping.twelfthIndex);
            String cgpaStr = safeGetValue(values, mapping.cgpaIndex);
            String standingArrearsStr = safeGetValue(values, mapping.standingArrearsIndex);
            String historyArrearsStr = safeGetValue(values, mapping.historyArrearsIndex);
            String collegeEmail = safeGetValue(values, mapping.collegeEmailIndex);
            String personalEmail = safeGetValue(values, mapping.personalEmailIndex);
            String mobile = safeGetValue(values, mapping.mobileIndex);
            String whatsapp = safeGetValue(values, mapping.whatsappIndex);
            String technicalLanguages = safeGetValue(values, mapping.technicalLanguagesIndex);
            String certifications = safeGetValue(values, mapping.certificationsIndex);
            String achievements = safeGetValue(values, mapping.achievementsIndex);
            String otherLanguages = safeGetValue(values, mapping.otherLanguagesIndex);
            String fullAddress = safeGetValue(values, mapping.fullAddressIndex);
            String city = safeGetValue(values, mapping.cityIndex);
            String state = safeGetValue(values, mapping.stateIndex);
            String aadhar = safeGetValue(values, mapping.aadharIndex);
            String pan = safeGetValue(values, mapping.panIndex);

            // Skip rows that are fully empty in the required identity fields.
            if (name.isEmpty() && collegeEmail.isEmpty()) {
                return;
            }

            // Validate required fields
            if (name.isEmpty() || collegeEmail.isEmpty()) {
                errors.add("Row " + rowNumber + ": Name and College Email are required.");
                return;
            }

            // Check if student already exists (by college email)
            Optional<Student> existingStudent = studentService.getStudentByEmail(collegeEmail);
            if (existingStudent.isPresent()) {
                errors.add("Row " + rowNumber + ": Student with email " + collegeEmail + " already exists.");
                return;
            }

            String enrollmentNumber = regNo.isEmpty() ? name : regNo;
            Optional<Student> existingEnrollment = studentService.getStudentByEnrollmentNumber(enrollmentNumber);
            if (existingEnrollment.isPresent()) {
                errors.add("Row " + rowNumber + ": Student with enrollment/registration number " + enrollmentNumber + " already exists.");
                return;
            }

            if (!regNo.isEmpty()) {
                Optional<Student> existingRegistration = studentService.getStudentByRegistrationNumber(regNo);
                if (existingRegistration.isPresent()) {
                    errors.add("Row " + rowNumber + ": Registration number " + regNo + " already exists.");
                    return;
                }
            }

            if (!personalEmail.isEmpty()) {
                Optional<Student> existingPersonalEmail = studentService.getStudentByPersonalEmail(personalEmail);
                if (existingPersonalEmail.isPresent()) {
                    errors.add("Row " + rowNumber + ": Personal email " + personalEmail + " already exists.");
                    return;
                }
            }

            Student student = new Student();
            student.setRegistrationNumber(regNo.isEmpty() ? null : regNo);
            student.setName(name);
            student.setCollegeEmail(collegeEmail);
            student.setPersonalEmail(personalEmail.isEmpty() ? null : personalEmail);
            student.setCareerPath(careerPath.isEmpty() ? null : careerPath);
            student.setLmsPortalLevelCompletion(lmsPortal.isEmpty() ? null : lmsPortal);
            student.setDegree(degree.isEmpty() ? null : degree);
            student.setDepartment(department.isEmpty() ? null : department);
            student.setGender(gender.isEmpty() ? null : gender);
            student.setMobileNumber(mobile.isEmpty() ? null : mobile);
            student.setWhatsappNumber(whatsapp.isEmpty() ? null : whatsapp);
            student.setTechnicalLanguagesKnown(technicalLanguages.isEmpty() ? null : technicalLanguages);
            student.setCertificationsCompleted(certifications.isEmpty() ? null : certifications);
            student.setAchievements(achievements.isEmpty() ? null : achievements);
            student.setOtherCommunicationLanguages(otherLanguages.isEmpty() ? null : otherLanguages);
            student.setFullAddress(fullAddress.isEmpty() ? null : fullAddress);
            student.setCity(city.isEmpty() ? null : city);
            student.setState(state.isEmpty() ? null : state);
            student.setAadharNumber(aadhar.isEmpty() ? null : aadhar);
            student.setPanNumber(pan.isEmpty() ? null : pan);
            student.setEnrollmentNumber(enrollmentNumber);

            // Parse optional numeric fields safely. Do not reject the entire row for malformed optional values.
            Double tenthPercentage = parseDoubleField(tenthStr, rowNumber, "10th Percentage", errors);
            if (tenthPercentage != null) {
                student.setTenthPercentage(tenthPercentage);
            }

            Double twelfthPercentage = parseDoubleField(twelfthStr, rowNumber, "12th/Diploma Percentage", errors);
            if (twelfthPercentage != null) {
                student.setTwelfthDiplomaPercentage(twelfthPercentage);
            }

            Double cgpa = parseDoubleField(cgpaStr, rowNumber, "CGPA", errors);
            if (cgpa != null) {
                student.setCgpa(cgpa);
            }

            Integer standingArrears = parseIntegerField(standingArrearsStr, rowNumber, "Standing Arrears", errors);
            if (standingArrears != null) {
                student.setStandingArrearsCount(standingArrears);
            }

            Integer historyArrears = parseIntegerField(historyArrearsStr, rowNumber, "History Arrears", errors);
            if (historyArrears != null) {
                student.setHistoryArrearsCount(historyArrears);
            }

            students.add(student);

        } catch (Exception e) {
            errors.add("Row " + rowNumber + ": Error processing row - " + e.getMessage());
        }
    }

    private static boolean isNumeric(String str) {
        try {
            Double.parseDouble(str);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private static String safeGetValue(String[] values, int index) {
        if (values == null || index >= values.length) {
            return "";
        }
        String value = values[index];
        if (value == null) {
            return "";
        }
        return value.trim();
    }

    private ColumnMapping buildColumnMapping(String[] headerValues) {
        ColumnMapping mapping = new ColumnMapping();
        if (headerValues == null) {
            return mapping;
        }

        for (int i = 0; i < headerValues.length; i++) {
            String normalized = normalizeHeader(headerValues[i]);
            if (normalized.isEmpty()) {
                continue;
            }

            if (normalized.contains("reg") || normalized.contains("registration")) {
                mapping.regNoIndex = i;
            } else if (normalized.startsWith("name") || normalized.contains("name in caps")) {
                mapping.nameIndex = i;
            } else if (normalized.contains("career") && normalized.contains("path")) {
                mapping.careerPathIndex = i;
            } else if (normalized.contains("lms") || normalized.contains("portal levels completion")) {
                mapping.lmsPortalIndex = i;
            } else if (normalized.equals("degree") || normalized.startsWith("degree ")) {
                mapping.degreeIndex = i;
            } else if (normalized.contains("department")) {
                mapping.departmentIndex = i;
            } else if (normalized.contains("gender")) {
                mapping.genderIndex = i;
            } else if (normalized.contains("10th") || normalized.contains("tenth")) {
                mapping.tenthIndex = i;
            } else if (normalized.contains("12th") || normalized.contains("diploma")) {
                mapping.twelfthIndex = i;
            } else if (normalized.contains("cgpa")) {
                mapping.cgpaIndex = i;
            } else if (normalized.contains("standing") && normalized.contains("arrears")) {
                mapping.standingArrearsIndex = i;
            } else if (normalized.contains("history") && normalized.contains("arrears")) {
                mapping.historyArrearsIndex = i;
            } else if (normalized.contains("college") && normalized.contains("email")) {
                mapping.collegeEmailIndex = i;
            } else if (normalized.contains("personal") && normalized.contains("email")) {
                mapping.personalEmailIndex = i;
            } else if (normalized.contains("whatsapp")) {
                mapping.whatsappIndex = i;
            } else if (normalized.contains("mobile") || normalized.contains("contact number")) {
                mapping.mobileIndex = i;
            } else if (normalized.contains("technical") && normalized.contains("language")) {
                mapping.technicalLanguagesIndex = i;
            } else if (normalized.contains("certification")) {
                mapping.certificationsIndex = i;
            } else if (normalized.contains("achievement")) {
                mapping.achievementsIndex = i;
            } else if (normalized.contains("other") && normalized.contains("language")) {
                mapping.otherLanguagesIndex = i;
            } else if (normalized.contains("full address") || (normalized.startsWith("address") && !normalized.contains("email"))) {
                mapping.fullAddressIndex = i;
            } else if (normalized.equals("city") || normalized.startsWith("city ")) {
                mapping.cityIndex = i;
            } else if (normalized.equals("state") || normalized.startsWith("state ")) {
                mapping.stateIndex = i;
            } else if (normalized.contains("aadhar")) {
                mapping.aadharIndex = i;
            } else if (normalized.contains("pan")) {
                mapping.panIndex = i;
            }
        }

        return mapping;
    }

    private static String normalizeHeader(String header) {
        if (header == null) {
            return "";
        }

        return header
                .toLowerCase()
                .replace("\n", " ")
                .replace("\r", " ")
                .replaceAll("[^a-z0-9 ]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private static Double parseDoubleField(String value, int rowNumber, String fieldName, List<String> errors) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        try {
            return Double.parseDouble(value.trim());
        } catch (NumberFormatException e) {
            errors.add("Row " + rowNumber + ": Invalid " + fieldName + " value '" + value + "'.");
            return null;
        }
    }

    private static Integer parseIntegerField(String value, int rowNumber, String fieldName, List<String> errors) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        String trimmed = value.trim();
        try {
            if (trimmed.matches("^-?\\d+$")) {
                return Integer.parseInt(trimmed);
            }

            double asDouble = Double.parseDouble(trimmed);
            if (Math.floor(asDouble) == asDouble) {
                return (int) asDouble;
            }

            errors.add("Row " + rowNumber + ": " + fieldName + " must be a whole number, got '" + value + "'.");
            return null;
        } catch (NumberFormatException e) {
            errors.add("Row " + rowNumber + ": Invalid " + fieldName + " value '" + value + "'.");
            return null;
        }
    }

    private static String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }

        try {
            DataFormatter dataFormatter = new DataFormatter();
            return dataFormatter.formatCellValue(cell).trim();
        } catch (Exception e) {
            return "";
        }
    }

    private static String getRootCauseMessage(Throwable throwable) {
        String rootCause = NestedExceptionUtils.getMostSpecificCause(throwable).getMessage();
        if (rootCause == null || rootCause.trim().isEmpty()) {
            return throwable.getMessage();
        }
        return rootCause;
    }

    private static class ColumnMapping {
        int regNoIndex = 0;
        int nameIndex = 1;
        int careerPathIndex = 2;
        int lmsPortalIndex = 3;
        int degreeIndex = 4;
        int departmentIndex = 5;
        int genderIndex = 6;
        int tenthIndex = 7;
        int twelfthIndex = 8;
        int cgpaIndex = 9;
        int standingArrearsIndex = 10;
        int historyArrearsIndex = 11;
        int collegeEmailIndex = 12;
        int personalEmailIndex = 13;
        int mobileIndex = 14;
        int whatsappIndex = 15;
        int technicalLanguagesIndex = 16;
        int certificationsIndex = 17;
        int achievementsIndex = 18;
        int otherLanguagesIndex = 19;
        int fullAddressIndex = 20;
        int cityIndex = 21;
        int stateIndex = 22;
        int aadharIndex = 23;
        int panIndex = 24;
    }

}
