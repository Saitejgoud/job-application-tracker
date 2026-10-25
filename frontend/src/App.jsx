import { useState } from "react";
import { useAuth } from "./context/AuthContext.jsx";
import AuthPage from "./components/AuthPage.jsx";
import Tracker from "./components/Tracker.jsx";
import AdminPanel from "./components/AdminPanel.jsx";

export default function App() {
  const { auth, logout } = useAuth();
  const [tab, setTab] = useState("mine");

  // Not logged in -> show login / register
  if (!auth) {
    return <AuthPage />;
  }

  const isAdmin = auth.role === "ADMIN";

  return (
    <div className="container">
      <header className="topbar">
        <div>
          <h1>Job Application Tracker</h1>
          <p className="subtitle">Keep track of every company you have applied to.</p>
        </div>
        <div className="userbox">
          <span>
            Hello, <b>{auth.name}</b>
          </span>
          <span className={`role role-${auth.role.toLowerCase()}`}>{auth.role}</span>
          <button className="btn small" onClick={logout}>
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
    </div>
  );
}
