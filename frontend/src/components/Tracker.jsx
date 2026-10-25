import { useEffect, useState } from "react";
import {
  getApplications,
  getStats,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../api";
import ApplicationForm from "./ApplicationForm.jsx";
import ApplicationTable from "./ApplicationTable.jsx";
import StatsCards from "./StatsCards.jsx";
import useSlow from "../useSlow.js";

const STATUSES = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

// The logged-in user's own applications (what App.jsx used to contain).
export default function Tracker() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const showSlowMessage = useSlow(initialLoading);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const loadData = async () => {
    try {
      const [listRes, statsRes] = await Promise.all([
        getApplications(filter),
        getStats(),
      ]);
      setApplications(listRes.data);
      setStats(statsRes.data);
      setError("");
    } catch (e) {
      setError("Cannot reach the backend. Is Spring Boot running?");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filter]);

  // Returns null on success, or an object of field errors from the backend
  const handleSave = async (data) => {
    try {
      const wasEditing = Boolean(editing);
      if (editing) {
        await updateApplication(editing.id, data);
        setEditing(null);
      } else {
        await createApplication(data);
      }
      await loadData();
      setToast(wasEditing ? "Application updated" : "Application added");
      return null;
    } catch (e) {
      if (e.response && e.response.status === 400) return e.response.data;
      setError("Something went wrong while saving.");
      return { error: "Save failed" };
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await deleteApplication(id);
      if (editing && editing.id === id) setEditing(null);
      await loadData();
      setToast("Application deleted");
    } catch (e) {
      setError("Could not delete the application.");
    }
  };

  return (
    <>
      {error && <div className="banner">{error}</div>}
      {initialLoading && (
        <div className="loading-state" role="status">
          <span className="spinner" aria-hidden="true" />
          <span>{showSlowMessage ? "The server is waking up. This can take up to a minute on the free plan." : "Loading your applications..."}</span>
        </div>
      )}
      {toast && <div className="toast" role="status">{toast}</div>}

      <StatsCards stats={stats} />

      <ApplicationForm
        key={editing ? editing.id : "new"}
        statuses={STATUSES}
        editing={editing}
        onSave={handleSave}
        onCancel={() => setEditing(null)}
      />

      <div className="toolbar">
        <h2>My applications ({applications.length})</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <ApplicationTable
        applications={applications}
        onEdit={setEditing}
        onDelete={handleDelete}
      />
    </>
  );
}
