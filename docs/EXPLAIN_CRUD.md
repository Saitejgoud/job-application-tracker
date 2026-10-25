# Explain this project (interview notes)

## 30-second pitch
"I built a Job Application Tracker. A user can add the jobs they applied to, update the
status like Applied, Interview, or Offer, filter by status, and see a count per status.
The backend is Spring Boot with Spring Data JPA and MySQL. The frontend is React, which
calls my REST APIs using Axios."

## Request flow (say this out loud)
1. User clicks Add in React -> Axios sends POST /api/applications with JSON.
2. ApplicationController receives it. @Valid checks the fields using ApplicationRequest.
3. Controller calls ApplicationService.
4. Service copies the data into a JobApplication entity and calls the repository.
5. ApplicationRepository (JpaRepository) saves it to MySQL.
6. The saved object returns as JSON, and React reloads the list.

## What each file does
- JobApplication: @Entity, one object = one row in job_applications.
- Status: enum so only 4 valid values are allowed.
- ApplicationRequest: DTO with validation (@NotBlank, @NotNull, @PastOrPresent, @Size).
- ApplicationRepository: extends JpaRepository; Spring builds queries from method names.
- ApplicationService: business logic, throws 404 if the id does not exist.
- ApplicationController: maps HTTP methods and URLs to service calls.
- GlobalExceptionHandler (@RestControllerAdvice): converts errors to clean JSON (400, 404).
- CorsConfig: allows the React app (port 5173) to call the API (port 8080).

## Questions and answers
- Why Controller / Service / Repository? Separation of concerns: easier to test and maintain.
- What is JPA / Hibernate? Maps Java classes to tables, so I do not write SQL for basic CRUD.
- What does @Entity do? Marks the class as a database table.
- What does ddl-auto=update do? Creates or updates the table automatically from the entity.
- Why a DTO and not the entity directly? Controls what the client can send and keeps validation
  separate from the database model.
- What is @Valid? Triggers the validation annotations on the request body.
- What is @RestControllerAdvice? One global place to handle exceptions.
- What is CORS and how did you fix it? Browser blocks cross-origin calls; I allowed the React
  origin in CorsConfig.
- Why constructor injection? Makes dependencies explicit and the class easier to test.
- What status codes do you return? 201 create, 200 read/update, 204 delete, 400 invalid, 404 missing.
- What would you improve? JWT login, pagination, more tests, deployment.

## Be honest about
- Login/JWT is not built in this version. Say "that is my next step".
- Only claim what you can explain line by line.
