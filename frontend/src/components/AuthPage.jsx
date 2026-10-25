import { useEffect, useState } from "react";
import { API_BASE, loginUser, registerUser } from "../api";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "./Logo.jsx";

export default function AuthPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sessionMessage, setSessionMessage] = useState("");

  useEffect(() => {
    const message = sessionStorage.getItem("jt_session_message");
    if (message) setSessionMessage(message);
    sessionStorage.removeItem("jt_session_message");
  }, []);

  const isRegister = mode === "register";

  useEffect(() => {
    fetch(`${API_BASE}/auth/ping`).catch(() => {});
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const switchMode = () => {
    setMode(isRegister ? "login" : "register");
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const res = isRegister
        ? await registerUser(form)
        : await loginUser({ email: form.email, password: form.password });
      login(res.data); // saves the token and shows the app
    } catch (err) {
      if (err.response && err.response.data) {
        setErrors(err.response.data); // field errors or { error: "..." }
      } else {
        setErrors({ error: "Cannot reach the server. Is the backend running?" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <main className="auth-layout">
        <section className="auth-brand">
          <div className="auth-brand-title">
            <Logo />
            <span>Job Application Tracker</span>
          </div>
          <p className="auth-tagline">Make your next move count.</p>
          <ul className="benefits">
            <li>Keep every application in one place</li>
            <li>Stay on top of interviews and offers</li>
            <li>See your progress at a glance</li>
          </ul>
        </section>

        <form className="card auth-card" onSubmit={handleSubmit}>
          <h1>{isRegister ? "Create your account" : "Welcome back"}</h1>
          <p className="subtitle">
            {isRegister ? "Start organizing your job search." : "Log in to your account."}
          </p>
          {sessionMessage && <div className="banner">{sessionMessage}</div>}

          {isRegister && (
            <label>
              Name
              <input
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
              {errors.name && <span className="err">{errors.name}</span>}
            </label>
          )}

          <label>
            Email
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <span className="err">{errors.email}</span>}
          </label>

          <label>
            Password
            <span className="password-control">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete={isRegister ? "new-password" : "current-password"}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </span>
            {errors.password && <span className="err">{errors.password}</span>}
          </label>

          {errors.error && <div className="banner">{errors.error}</div>}

          <button type="submit" className="btn primary full auth-submit" disabled={loading}>
            {loading && <span className="spinner button-spinner" aria-hidden="true" />}
            {loading ? "Please wait..." : isRegister ? "Create account" : "Log in"}
          </button>

          <p className="switch">
            {isRegister ? "Already have an account?" : "New here?"}{" "}
            <button type="button" className="link" onClick={switchMode}>
              {isRegister ? "Log in" : "Create an account"}
            </button>
          </p>
        </form>
      </main>
    </div>
  );
}
