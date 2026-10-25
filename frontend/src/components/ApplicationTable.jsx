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
              <td data-label="Company">
                {a.jobLink ? (
                  <a href={a.jobLink} target="_blank" rel="noreferrer">
                    {a.company}
                  </a>
                ) : (
                  a.company
                )}
              </td>
              <td data-label="Role">{a.roleTitle}</td>
              <td data-label="Status">
                <span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span>
              </td>
              <td data-label="Applied">{a.appliedDate}</td>
              <td data-label="Notes" className="notes">{a.notes}</td>
              <td data-label="Actions">
                <div className="row-actions">
                  <button className="btn small" onClick={() => onEdit(a)}>
                    Edit
                  </button>
                  <button className="btn small danger" onClick={() => onDelete(a.id)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
