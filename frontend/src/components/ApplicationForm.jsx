import { useState } from "react";

const today = () => new Date().toISOString().split("T")[0];

export default function ApplicationForm({ statuses, editing, onSave, onCancel }) {
  const [form, setForm] = useState({
    company: editing?.company ?? "",
    roleTitle: editing?.roleTitle ?? "",
    status: editing?.status ?? "APPLIED",
    appliedDate: editing?.appliedDate ?? today(),
    notes: editing?.notes ?? "",
    jobLink: editing?.jobLink ?? "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onSave(form);
    if (result) {
      setErrors(result); // show backend validation messages
    } else {
      setErrors({});
      if (!editing) {
        setForm({ ...form, company: "", roleTitle: "", notes: "", jobLink: "" });
      }
    }
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>{editing ? "Edit application" : "Add application"}</h2>

      <div className="grid">
        <label>
          Company
          <input name="company" value={form.company} onChange={handleChange} />
          {errors.company && <span className="err">{errors.company}</span>}
        </label>

        <label>
          Role
          <input name="roleTitle" value={form.roleTitle} onChange={handleChange} />
          {errors.roleTitle && <span className="err">{errors.roleTitle}</span>}
        </label>

        <label>
          Status
          <select name="status" value={form.status} onChange={handleChange}>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.status && <span className="err">{errors.status}</span>}
        </label>

        <label>
          Applied date
          <input
            type="date"
            name="appliedDate"
            value={form.appliedDate}
            max={today()}
            onChange={handleChange}
          />
          {errors.appliedDate && <span className="err">{errors.appliedDate}</span>}
        </label>

        <label className="wide">
          Job link (optional)
          <input name="jobLink" value={form.jobLink} onChange={handleChange} />
          {errors.jobLink && <span className="err">{errors.jobLink}</span>}
        </label>

        <label className="wide">
          Notes (optional)
          <textarea name="notes" rows="2" value={form.notes} onChange={handleChange} />
          {errors.notes && <span className="err">{errors.notes}</span>}
        </label>
      </div>

      {errors.error && <span className="err">{errors.error}</span>}

      <div className="actions">
        <button type="submit" className="btn primary">
          {editing ? "Update" : "Add"}
        </button>
        {editing && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
