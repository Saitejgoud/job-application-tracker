import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext.jsx";
import AuthPage from "./components/AuthPage.jsx";
import Tracker from "./components/Tracker.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import Logo from "./components/Logo.jsx";

export default function App() {
  const { auth, logout } = useAuth();
  const [tab, setTab] = useState(() => localStorage.getItem("jt_tab") || "mine");

  useEffect(() => {
    localStorage.setItem("jt_tab", tab);
  }, [tab]);

  // Not logged in -> show login / register
  if (!auth) {
    return <AuthPage />;
  }

  const isAdmin = auth.role === "ADMIN";

  return (
    <div className="container">
      <header className="topbar">
        <div className="brand">
          <Logo />
          <div>
            <h1>Job Application Tracker</h1>
            <p className="subtitle">Keep track of every company you have applied to.</p>
          </div>
        </div>
        <div className="userbox">
          <span className="avatar" aria-hidden="true">
            {(auth.name || auth.email || "?").charAt(0).toUpperCase()}
          </span>
          <span className="user-name">{auth.name}</span>
          <span className={`role role-${auth.role.toLowerCase()}`}>{auth.role}</span>
          <button className="btn small logout" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {isAdmin && (
        <div className="tabs">
          <button
            className={tab === "mine" ? "tab active" : "tab"}
            onClick={() => setTab("mine")}
          >
            My applications
          </button>
          <button
            className={tab === "admin" ? "tab active" : "tab"}
            onClick={() => setTab("admin")}
          >
            Admin
          </button>
        </div>
      )}

      {isAdmin && tab === "admin" ? <AdminPanel /> : <Tracker />}
      <footer className="app-footer">Stay organized. Find your next opportunity.</footer>
    </div>
  );
}
