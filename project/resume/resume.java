import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;

public class ResumeGenerator {

    public static void main(String[] args) {
        String excelFilePath = "project1.xlsx"; // Your Excel file
        String outputDir = "resumes";

        try (FileInputStream fis = new FileInputStream(excelFilePath);
             Workbook workbook = new XSSFWorkbook(fis)) {

            Sheet sheet = workbook.getSheetAt(0);

            // Create output directory if not exists
            Files.createDirectories(Paths.get(outputDir));

            for (int i = 1; i <= sheet.getLastRowNum(); i++) { // Skip header
                Row row = sheet.getRow(i);
                if (row == null) continue;

                String name = getCellValue(row, 0);
                String address = getCellValue(row, 1);
                String phone = getCellValue(row, 2);
                String email = getCellValue(row, 3);
                String objective = getCellValue(row, 4);
                String degree = getCellValue(row, 5);
                String university = getCellValue(row, 6);
                String gradYear = getCellValue(row, 7);
                String gpa = getCellValue(row, 8);
                String coursework = getCellValue(row, 9);
                String expTitle = getCellValue(row, 10);
                String expDuration = getCellValue(row, 11);
                String expDetails = getCellValue(row, 12);
                String skills = getCellValue(row, 13);

                String html = generateHTML(name, address, phone, email, objective, degree, university,
                        gradYear, gpa, coursework, expTitle, expDuration, expDetails, skills);

                String fileName = outputDir + "/" + name.replace(" ", "_") + ".html";
                Files.write(Paths.get(fileName), html.getBytes());
            }

            System.out.println("✅ HTML resumes generated successfully in /resumes folder.");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static String getCellValue(Row row, int colIndex) {
        Cell cell = row.getCell(colIndex);
        if (cell == null) return "";
        return cell.getCellType() == CellType.NUMERIC
                ? String.valueOf((long) cell.getNumericCellValue())
                : cell.getStringCellValue();
    }

    private static String generateHTML(String name, String address, String phone, String email,
                                       String objective, String degree, String university, String gradYear,
                                       String gpa, String coursework, String expTitle, String expDuration,
                                       String expDetails, String skills) {

        String[] expItems = expDetails.split(";");
        StringBuilder expList = new StringBuilder();
        for (String item : expItems) {
            expList.append("<li>").append(item.trim()).append("</li>\n");
        }

        String[] skillItems = skills.split(",");
        StringBuilder skillList = new StringBuilder();
        for (String skill : skillItems) {
            skillList.append("<li>").append(skill.trim()).append("</li>\n");
        }

        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Student Resume</title>
                    <link rel="stylesheet" href="styles_updated.css">
                </head>
                <body>
                    <header>
                        <img src="siet.jpg">
                    </header>
                    <main>
                        <section id="personal-details">
                            <div class="profile-container">
                                <img src="OIP.jpg" alt="Profile Photo" id="profile-photo">
                                <div class="details">
                                    <h2>""" + name + """</h2>
                                    <p><strong>Address:</strong> """ + address + """</p>
                                    <p><strong>Phone:</strong> """ + phone + """</p>
                                    <p><strong>Email:</strong> """ + email + """</p>
                                </div>
                            </div>
                        </section>
                        <section id="objective">
                            <h2>Objective</h2>
                            <p>""" + objective + """</p>
                        </section>
                        <section id="education">
                            <h2>Education</h2>
                            <p><strong>""" + degree + """</strong></p>
                            <p>""" + university + """, Expected Graduation: """ + gradYear + """</p>
                            <p><strong>GPA:</strong> """ + gpa + """</p>
                            <p><strong>Relevant Coursework:</strong> """ + coursework + """</p>
                        </section>
                        <section id="experience">
                            <h2>Experience</h2>
                            <h3>""" + expTitle + """</h3>
                            <p>""" + expDuration + """</p>
                            <ul>
                                """ + expList + """
                            </ul>
                        </section>
                        <section id="skills">
                            <h2>Skills</h2>
                            <ul>
                                """ + skillList + """
                            </ul>
                        </section>
                    </main>
                    <footer>
                        <p>&copy; 2023 Student Portal</p>
                    </footer>
                </body>
                </html>
                """;
    }
}
