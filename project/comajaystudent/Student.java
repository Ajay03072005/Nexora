package comajaystudent;

public class Student {
    private String rollno, name, department, year, address, bloodgroup, photo;

    // Constructors, Getters, Setters
    public Student() {}

    public Student(String rollno, String name, String department, String year, String address, String bloodgroup, String photo) {
        this.rollno = rollno;
        this.name = name;
        this.department = department;
        this.year = year;
        this.address = address;
        this.bloodgroup = bloodgroup;
        this.photo = photo;
    }

    // Getters & Setters
    public String getRollno() { return rollno; }
    public void setRollno(String rollno) { this.rollno = rollno; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getBloodgroup() { return bloodgroup; }
    public void setBloodgroup(String bloodgroup) { this.bloodgroup = bloodgroup; }

    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }
}
