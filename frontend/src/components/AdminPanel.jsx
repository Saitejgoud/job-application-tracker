import { useEffect, useState } from "react";
import { getAdminUsers, getAdminApplications, getAdminStats } from "../api";
import StatsCards from "./StatsCards.jsx";
import useSlow from "../useSlow.js";
import { downloadAllDataCsv, downloadUsersCsv } from "../csv.js";

// ADMIN only: overview of every user and every application.
export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const showSlowMessage = useSlow(loading);

  useEffect(() => {
    const load = async () => {
      try {
        const [u, a, s] = await Promise.all([
          getAdminUsers(),
          getAdminApplications(),
          getAdminStats(),
        ]);
        setUsers(u.data);
        setApplications(a.data);
        setStats(s.data);
      } catch (e) {
        setError("Could not load admin data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      {error && <div className="banner">{error}</div>}
      {loading && (
        <div className="loading-state" role="status">
          <span className="spinner" aria-hidden="true" />
          <span>{showSlowMessage ? "The server is waking up. This can take up to a minute on the free plan." : "Loading admin data..."}</span>
        </div>
      )}

      <div className="export-actions">
        <button className="btn" onClick={() => downloadAllDataCsv(users, applications)}>
          Download all data (CSV)
        </button>
        <button className="btn" onClick={() => downloadUsersCsv(users, applications)}>
          Users only
        </button>
      </div>

      <h2 className="section-title">All applications by status</h2>
      <StatsCards stats={stats} />

      <h2 className="section-title">Users ({users.length})</h2>
      <div className="table-wrap spaced">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Applications</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td data-label="Name">{u.name}</td>
                <td data-label="Email">{u.email}</td>
                <td data-label="Role">
                  <span className={`role role-${u.role.toLowerCase()}`}>{u.role}</span>
                </td>
                <td data-label="Applications">{u.applicationCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">All applications ({applications.length})</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Owner</th>
              <th>Company</th>
              <th>Role</th>
              <th>Status</th>
              <th>Applied</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((a) => (
              <tr key={a.id}>
                <td data-label="Owner">{a.ownerEmail || "-"}</td>
                <td data-label="Company">{a.company}</td>
                <td data-label="Role">{a.roleTitle}</td>
                <td data-label="Status">
                  <span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span>
                </td>
                <td data-label="Applied">{a.appliedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
