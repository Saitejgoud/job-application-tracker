# Free deployment checklist

Cost: Rs 0 (GitHub + Aiven free MySQL + Render free web service + Netlify free).
Free plans change, check each site when you sign up. The Render free backend sleeps after
about 15 minutes idle, so the first load can take about a minute.

1. Run locally once (see README) and check login works.
2. Push to GitHub (never commit passwords or secrets).
3. Aiven: create a free MySQL service, copy host, port, user, password.
4. Render: New > Web Service > your repo. Root Directory = backend, Runtime = Docker, Instance = Free.
   Environment variables:
     DB_URL            jdbc:mysql://HOST:PORT/defaultdb?sslMode=REQUIRED
     DB_USERNAME       avnadmin
     DB_PASSWORD       (Aiven password)
     JWT_SECRET        a long random string, at least 32 characters
     ADMIN_EMAIL       your admin email
     ADMIN_PASSWORD    a strong password
     APP_CORS_ORIGINS  http://localhost:5173   (change in step 6)
5. Netlify: Import from GitHub (netlify.toml is included).
   Environment variable:
     VITE_API_URL      https://YOUR-RENDER-URL.onrender.com/api
6. Render: set APP_CORS_ORIGINS to your Netlify URL (no trailing slash).
7. Open the Netlify URL, register a user, and test. Log in with ADMIN_EMAIL to see the Admin tab.
