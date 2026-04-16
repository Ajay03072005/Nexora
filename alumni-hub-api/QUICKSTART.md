# AlumniHub Backend - Quick Start

Backend folder location: `NEXORA/alumni-hub-api/`

## Setup Steps

### 1. Setup MySQL Database
```bash
mysql -u root -p < alumni-hub-api/src/main/resources/database/schema.sql
```

### 2. Configure Database
Edit `alumni-hub-api/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### 3. Build & Run
```bash
cd alumni-hub-api
mvn clean install
mvn spring-boot:run
```

Server runs at: **http://localhost:8080/api**

### 4. Load Sample Data (Optional)
```bash
mysql -u root -p alumni_hub_db < alumni-hub-api/src/main/resources/database/sample_data.sql
```

## API Base URL
```
http://localhost:8080/api
```

## Available Endpoints
- `/api/students` - Student management
- `/api/alumni` - Alumni management
- `/api/jobs` - Job postings
- `/api/events` - Events management
- `/api/colleges` - College management

See `README.md` for complete documentation.
