# Explain authentication (interview notes)

## 30-second pitch
"I added JWT authentication with Spring Security. Users register and log in, passwords are
hashed with BCrypt, and login returns a signed JWT. React stores the token and sends it in the
Authorization header. A filter in Spring validates it on every request. Each user only sees
their own applications, and an ADMIN role can view all users and all data."

## Login flow (say this out loud)
1. React sends email + password to POST /api/auth/login.
2. AuthService finds the user by email and checks the password with BCrypt matches().
3. JwtService creates a token containing the email, role, and an expiry, signed with a secret.
4. React saves the token and an Axios interceptor adds "Authorization: Bearer <token>" to every call.
5. JwtAuthFilter runs before the controller: validates the token, loads the user, and puts it
   in the SecurityContext.
6. SecurityConfig decides access: /api/auth/** public, /api/admin/** ADMIN only, rest needs login.
7. The controller receives the user with @AuthenticationPrincipal and the service queries only
   that user's rows.

## What each new file does
- User / Role: the users table and the USER / ADMIN roles.
- JobApplication.user: @ManyToOne link, many applications belong to one user.
- JwtService: creates and validates tokens.
- JwtAuthFilter: reads the Bearer token on each request (OncePerRequestFilter).
- SecurityConfig: stateless sessions, CSRF disabled, route rules, BCrypt bean, CORS.
- AuthService / AuthController: register and login.
- ApplicationService: every method takes the User, so queries are scoped (findByIdAndUser).
- AdminService / AdminController: read-only data across all users.
- AdminSeeder: creates the first admin from environment variables.
- GlobalExceptionHandler: 400 / 401 / 404 / 409 as JSON.

## Questions and answers
- What is a JWT? A signed string with the user's email, role, and expiry. The server verifies the
  signature with its secret, so it does not need to store sessions.
- Why BCrypt? It is a slow, salted hash, so stolen hashes are hard to crack. Passwords are never stored in plain text.
- Why stateless sessions? The token carries the identity, so the server keeps no session and scales easily.
- Why disable CSRF? CSRF attacks rely on cookies the browser sends automatically. We send the token
  manually in a header, so it does not apply.
- 401 vs 403? 401: not logged in or bad token. 403: logged in but not allowed (a USER calling an admin API).
- How do you stop user A reading user B's data? Queries always filter by the logged-in user
  (findByIdAndUser). Someone else's id returns 404, so it does not even confirm it exists.
- Why return the same message for wrong email and wrong password? So attackers cannot find which emails are registered.
- Where is the token stored and what is the risk? localStorage. Simple, but JavaScript can read it, so
  an XSS bug could steal it. HttpOnly cookies are safer but need CSRF protection. I would move to
  cookies with a refresh token in a production app.
- How does a user become admin? Registration always creates a USER. The admin is created from
  environment variables at startup, or by an SQL update.
- What happens when the token expires? The API returns 401, and the React interceptor clears the
  login and shows the login page.

## Be honest about
- No refresh tokens, email verification, or password reset yet.
- Say "next I would add pagination, interview rounds, and tests for the service layer".
