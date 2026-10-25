export default function ApplicationTable({ applications, onEdit, onDelete }) {
  if (applications.length === 0) {
    return <p className="empty">No applications yet. Add your first one above.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Status</th>
            <th>Applied</th>
            <th>Notes</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {applications.map((a) => (
            <tr key={a.id}>
              <td>
                {a.jobLink ? (
                  <a href={a.jobLink} target="_blank" rel="noreferrer">
                    {a.company}
                  </a>
                ) : (
                  a.company
                )}
              </td>
              <td>{a.roleTitle}</td>
              <td>
                <span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span>
              </td>
              <td>{a.appliedDate}</td>
              <td className="notes">{a.notes}</td>
              <td className="row-actions">
                <button className="btn small" onClick={() => onEdit(a)}>
                  Edit
                </button>
                <button className="btn small danger" onClick={() => onDelete(a.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
