package com.alumniHub.controller;

import com.alumniHub.entity.College;
import com.alumniHub.service.CollegeService;
import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping("/colleges")
@CrossOrigin(origins = "*")
public class CollegeController {

    @Autowired
    private CollegeService collegeService;

    // Get all colleges
    @GetMapping
    public ResponseEntity<List<College>> getAllColleges() {
        List<College> colleges = collegeService.getAllColleges();
        return ResponseEntity.ok(colleges);
    }

    // Get college by ID
    @GetMapping("/{id}")
    public ResponseEntity<College> getCollegeById(@PathVariable Long id) {
        Optional<College> college = collegeService.getCollegeById(id);
        return college.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get college by email
    @GetMapping("/email/{email}")
    public ResponseEntity<College> getCollegeByEmail(@PathVariable String email) {
        Optional<College> college = collegeService.getCollegeByEmail(email);
        return college.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create new college
    @PostMapping
    public ResponseEntity<College> createCollege(@RequestBody College college) {
        College newCollege = collegeService.createCollege(college);
        return ResponseEntity.status(HttpStatus.CREATED).body(newCollege);
    }

    // Update college
    @PutMapping("/{id}")
    public ResponseEntity<College> updateCollege(@PathVariable Long id, @RequestBody College collegeDetails) {
        College updatedCollege = collegeService.updateCollege(id, collegeDetails);
        if (updatedCollege != null) {
            return ResponseEntity.ok(updatedCollege);
        }
        return ResponseEntity.notFound().build();
    }

    // Delete college
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCollege(@PathVariable Long id) {
        collegeService.deleteCollege(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Import colleges from CSV or Excel file
     * Supported formats: .csv, .xlsx, .xls
     * File Format: name, email, location, contactNumber, description
     */
    @PostMapping("/import/csv")
    public ResponseEntity<?> importCollegesFromCSV(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "File is empty");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            String filename = file.getOriginalFilename();
            List<College> colleges = new ArrayList<>();
            List<String> errors = new ArrayList<>();

            // Determine file type and process accordingly
            if (filename.endsWith(".csv")) {
                processCSVFile(file, colleges, errors);
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                processExcelFile(file, colleges, errors);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "File must be a CSV or Excel file (.csv, .xlsx, .xls)");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            // Save all valid colleges
            List<College> savedColleges = new ArrayList<>();
            for (College college : colleges) {
                try {
                    savedColleges.add(collegeService.createCollege(college));
                } catch (Exception e) {
                    errors.add("Error saving college " + college.getEmail() + ": " + e.getMessage());
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("totalRows", colleges.size() + errors.size());
            response.put("importedCount", savedColleges.size());
            response.put("errors", errors);
            response.put("colleges", savedColleges);

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
    private void processCSVFile(MultipartFile file, List<College> colleges, List<String> errors) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            int rowNumber = 0;
            boolean isHeader = true;

            while ((line = reader.readLine()) != null) {
                rowNumber++;

                // Skip header row
                if (isHeader) {
                    isHeader = false;
                    continue;
                }

                if (line.trim().isEmpty()) {
                    continue;
                }

                String[] values = line.split(",", -1);
                processRow(values, rowNumber, colleges, errors);
            }
        } catch (Exception e) {
            errors.add("Error reading CSV file: " + e.getMessage());
        }
    }

    /**
     * Process Excel file
     */
    private void processExcelFile(MultipartFile file, List<College> colleges, List<String> errors) {
        try {
            Workbook workbook;
            if (file.getOriginalFilename().endsWith(".xlsx")) {
                workbook = new XSSFWorkbook(file.getInputStream());
            } else {
                workbook = new HSSFWorkbook(file.getInputStream());
            }

            Sheet sheet = workbook.getSheetAt(0);
            int rowNumber = 0;
            boolean isHeader = true;

            for (Row row : sheet) {
                rowNumber++;

                // Skip header row
                if (isHeader) {
                    isHeader = false;
                    continue;
                }

                if (row.getPhysicalNumberOfCells() == 0) {
                    continue;
                }

                String[] values = new String[5];
                for (int i = 0; i < Math.min(5, row.getLastCellNum()); i++) {
                    Cell cell = row.getCell(i);
                    if (cell != null) {
                        cell.setCellType(CellType.STRING);
                        values[i] = cell.getStringCellValue();
                    } else {
                        values[i] = "";
                    }
                }

                processRow(values, rowNumber, colleges, errors);
            }

            workbook.close();
        } catch (Exception e) {
            errors.add("Error reading Excel file: " + e.getMessage());
        }
    }

    /**
     * Process a data row from CSV or Excel
     */
    private void processRow(String[] values, int rowNumber, List<College> colleges, List<String> errors) {
        if (values.length < 2) {
            errors.add("Row " + rowNumber + ": Invalid format. Expected at least name and email.");
            return;
        }

        try {
            String name = values[0].trim();
            String email = values[1].trim();
            String location = values.length > 2 ? values[2].trim() : "";
            String contactNumber = values.length > 3 ? values[3].trim() : "";
            String description = values.length > 4 ? values[4].trim() : "";

            // Validate required fields
            if (name.isEmpty() || email.isEmpty()) {
                errors.add("Row " + rowNumber + ": Name and email are required.");
                return;
            }

            // Check if college already exists
            Optional<College> existingCollege = collegeService.getCollegeByEmail(email);
            if (existingCollege.isPresent()) {
                errors.add("Row " + rowNumber + ": College with email " + email + " already exists.");
                return;
            }

            College college = new College();
            college.setName(name);
            college.setEmail(email);
            college.setLocation(location.isEmpty() ? null : location);
            college.setContactNumber(contactNumber.isEmpty() ? null : contactNumber);
            college.setDescription(description.isEmpty() ? null : description);
            college.setTotalStudents(0);
            college.setTotalAlumni(0);

            colleges.add(college);
        } catch (Exception e) {
            errors.add("Row " + rowNumber + ": Error processing row - " + e.getMessage());
        }
    }

}

