@WebServlet("/students")
public class StudentServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try (Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/studentdb", "root", "password")) {
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM students");

            JSONArray studentArray = new JSONArray();
            while (rs.next()) {
                JSONObject student = new JSONObject();
                student.put("rollno", rs.getString("rollno"));
                student.put("name", rs.getString("name"));
                student.put("department", rs.getString("department"));
                student.put("year", rs.getString("year"));
                student.put("address", rs.getString("address"));
                student.put("bloodgroup", rs.getString("bloodgroup"));
                student.put("photo", rs.getString("photo"));
                studentArray.put(student);
            }

            out.print(studentArray.toString());
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
        }
    }
}
