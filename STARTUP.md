# Automated Resume Management and Balanced Screening System

This platform consists of a **Next.js Frontend** and a **Java Spring Boot Backend**. Both need to be running simultaneously for the application to work.

## Prerequisites
- **Node.js**: Ensure Node.js and `npm` are installed.
- **Java**: Ensure Java Development Kit (JDK) 25 or compatible version is installed.
- **MySQL**: A local MySQL server running on port `3306` with the user `root` and password `jesin`.
- **Database**: Create a database named `resume_mgmt` in your local MySQL instance using: `CREATE DATABASE resume_mgmt;`

---

## 1. Starting the Backend (Spring Boot)

The Backend handles database operations, AI resume scoring, and the core API endpoints. It runs automatically on port `8080`.

1. Open a new Terminal (or Command Prompt).
2. Navigate to the backend directory:
   ```bash
   cd "d:\vs code\resume\antigravity\backend"
   ```
3. Run the Spring Boot application using Maven:
   ```bash
   .\mvnw spring-boot:run
   ```
   *(Wait until you see `Started BackendApplication` in the logs. If you get a "Web server failed to start" error, ensure no other application is using port 8080).*

---

## 2. Starting the Frontend (Next.js)

The Frontend provides the Applicant and Staff portals. It runs automatically on port `3000`.

1. Open a **second**, separate Terminal (or Command Prompt).
2. Navigate to the frontend directory:
   ```bash
   cd "d:\vs code\resume\antigravity\frontend"
   ```
3. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *(Wait until you see `Ready in ...ms` in the logs).*

---

## 3. Accessing the Application

Once both servers are running successfully, open your web browser and navigate to:

- **Home Page**: [http://localhost:3000](http://localhost:3000)
- **Applicant Portal**: [http://localhost:3000/applicant](http://localhost:3000/applicant)
- **Staff Portal**: [http://localhost:3000/staff](http://localhost:3000/staff)

*Note: The frontend API calls are configured to hit `http://localhost:8080`. Make sure your backend hasn't been assigned a different random port.*
