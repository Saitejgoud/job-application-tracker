import { useState } from "react";
import { loginUser, registerUser } from "../api";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

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
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Job Application Tracker</h1>
        <p className="subtitle">
          {isRegister ? "Create your account" : "Log in to your account"}
        </p>

        {isRegister && (
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} />
            {errors.name && <span className="err">{errors.name}</span>}
          </label>
        )}

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
          {errors.email && <span className="err">{errors.email}</span>}
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete={isRegister ? "new-password" : "current-password"}
          />
          {errors.password && <span className="err">{errors.password}</span>}
        </label>

        {errors.error && <div className="banner">{errors.error}</div>}

        <button type="submit" className="btn primary full" disabled={loading}>
          {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
        </button>

        <p className="switch">
          {isRegister ? "Already have an account?" : "New here?"}{" "}
          <button type="button" className="link" onClick={switchMode}>
            {isRegister ? "Login" : "Create an account"}
          </button>
        </p>
      </form>
    </div>
  );
}
