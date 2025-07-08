package comajaystudent;

import java.io.*;
import java.sql.*;
import java.util.*;

@WebServlet("/students")
public class StudentServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        JSONArray arr = new JSONArray();

        try (Connection con = DBUtil.getConnection()) {
            Statement st = con.createStatement();
            ResultSet rs = st.executeQuery("SELECT * FROM students");

            while (rs.next()) {
                JSONObject obj = new JSONObject();
                obj.put("rollno", rs.getString("rollno"));
                obj.put("name", rs.getString("name"));
                obj.put("department", rs.getString("department"));
                obj.put("year", rs.getString("year"));
                obj.put("address", rs.getString("address"));
                obj.put("bloodgroup", rs.getString("bloodgroup"));
                obj.put("photo", rs.getString("photo"));
                arr.put(obj);
            }

            out.print(arr.toString());
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        BufferedReader reader = request.getReader();
        StringBuilder sb = new StringBuilder();
        String line;
        while((line = reader.readLine()) != null) {
            sb.append(line);
        }

        try (Connection con = DBUtil.getConnection()) {
            JSONObject stu = new JSONObject(sb.toString());

            PreparedStatement ps = con.prepareStatement(
                "INSERT INTO students VALUES (?, ?, ?, ?, ?, ?, ?)"
            );

            ps.setString(1, stu.getString("rollno"));
            ps.setString(2, stu.getString("name"));
            ps.setString(3, stu.getString("department"));
            ps.setString(4, stu.getString("year"));
            ps.setString(5, stu.getString("address"));
            ps.setString(6, stu.getString("bloodgroup"));
            ps.setString(7, stu.getString("photo"));

            ps.executeUpdate();
            response.setStatus(201);
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
        }
    }
}
