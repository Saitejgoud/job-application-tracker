HEAD
# Job Application Tracker

A full-stack app to track the jobs you have applied to, with JWT login and an admin role.

**Stack:** Java 17, Spring Boot 3, Spring Security, JWT, Spring Data JPA (Hibernate), MySQL,
React (Vite), Axios, JUnit + MockMvc

## Features
- Register and login, passwords hashed with BCrypt, JWT authentication
- Roles: USER and ADMIN
- Each user sees only their own applications
- Add, view, edit, delete applications (CRUD)
- Status tracking: APPLIED, INTERVIEW, OFFER, REJECTED, with a filter and dashboard counts
- Admin tab: all users, all applications, overall stats
- Server-side validation and global exception handling (400 / 401 / 403 / 404 / 409)

## Architecture
React (Axios + JWT header) -> JwtAuthFilter -> Controller -> Service -> Repository -> MySQL

## Run locally

Requirements: JDK 17+, Maven, Node.js, MySQL.

### Backend
    cd backend
    # PowerShell (set your own values):
    $env:DB_PASSWORD    = "YourMySQLPassword"
    $env:ADMIN_EMAIL    = "admin@example.com"
    $env:ADMIN_PASSWORD = "Admin@12345"
    mvn clean spring-boot:run

API: http://localhost:8080 (database job_tracker is created automatically)

### Frontend
    cd frontend
    npm install
    npm run dev

App: http://localhost:5173

### Tests (in-memory H2, no MySQL needed)
    cd backend
    mvn test

## Environment variables (backend)

| Variable | Purpose | Default |
|---|---|---|
| DB_URL | JDBC URL | local MySQL job_tracker |
| DB_USERNAME | DB user | root |
| DB_PASSWORD | DB password | change_me |
| JWT_SECRET | token signing key (32+ chars) | dev-only value |
| ADMIN_EMAIL / ADMIN_PASSWORD | creates an admin at startup | empty (none) |
| APP_CORS_ORIGINS | allowed website origins | http://localhost:5173 |

Frontend: VITE_API_URL (API base URL when deployed).

## REST API

| Method | URL | Access |
|---|---|---|
| POST | /api/auth/register | public |
| POST | /api/auth/login | public |
| GET | /api/applications (optional ?status=APPLIED) | logged in |
| GET | /api/applications/{id} | logged in (own only) |
| GET | /api/applications/stats | logged in |
| POST | /api/applications | logged in |
| PUT | /api/applications/{id} | logged in (own only) |
| DELETE | /api/applications/{id} | logged in (own only) |
| GET | /api/admin/users | ADMIN |
| GET | /api/admin/applications | ADMIN |
| GET | /api/admin/stats | ADMIN |

Send the token as: `Authorization: Bearer <token>`

## Folder structure

    backend/src/main/java/com/jobtracker
      model/        User, Role, JobApplication, Status
      dto/          requests and responses
      repository/   UserRepository, ApplicationRepository
      service/      AuthService, ApplicationService, AdminService
      controller/   AuthController, ApplicationController, AdminController
      security/     JwtService, JwtAuthFilter
      config/       SecurityConfig, CorsConfig, AdminSeeder
      exception/    GlobalExceptionHandler and custom exceptions
    frontend/src
      api.js        all backend calls + token interceptor
      context/      AuthContext (login state)
      components/   AuthPage, Tracker, AdminPanel, form, table, stat cards
    docs/           interview notes and deployment guide

## Next steps
1. Pagination, search, sorting
2. Interview rounds (one-to-many)
3. Swagger docs and more tests
4. Dashboard charts and follow-up reminders
# job-application-tracker
 2fc90351e5626f49b66080bfb4cfabe8dac42442
