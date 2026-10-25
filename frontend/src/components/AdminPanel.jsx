import { useEffect, useState } from "react";
import { getAdminUsers, getAdminApplications, getAdminStats } from "../api";
import StatsCards from "./StatsCards.jsx";

// ADMIN only: overview of every user and every application.
export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [error, setError] = useState("");

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
      }
    };
    load();
  }, []);

  return (
    <>
      {error && <div className="banner">{error}</div>}

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
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`role role-${u.role.toLowerCase()}`}>{u.role}</span>
                </td>
                <td>{u.applicationCount}</td>
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
                <td>{a.ownerEmail || "-"}</td>
                <td>{a.company}</td>
                <td>{a.roleTitle}</td>
                <td>
                  <span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span>
                </td>
                <td>{a.appliedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
