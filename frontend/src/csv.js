const ALL_DATA_HEADERS = [
  "User ID",
  "Name",
  "Email",
  "Role",
  "Application ID",
  "Company",
  "Job Role",
  "Status",
  "Applied Date",
  "Job Link",
  "Notes",
];

const USERS_HEADERS = ["User ID", "Name", "Email", "Role", "Application Count"];

function safeCell(value) {
  const text = value == null ? "" : String(value);
  const protectedText = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${protectedText.replace(/"/g, '""')}"`;
}

function toCsv(headers, rows) {
  return `\uFEFF${[headers, ...rows]
    .map((row) => row.map(safeCell).join(","))
    .join("\r\n")}`;
}

function downloadCsv(filename, content) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function dateStamp() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function emailKey(email) {
  return String(email || "").trim().toLowerCase();
}

export function downloadAllDataCsv(users, applications) {
  const usersByEmail = new Map(users.map((user) => [emailKey(user.email), user]));
  const applicationUsers = new Set();
  const rows = applications.map((application) => {
    const user = usersByEmail.get(emailKey(application.ownerEmail));
    if (user) applicationUsers.add(emailKey(user.email));
    return [
      user?.id,
      user?.name,
      user?.email || application.ownerEmail,
      user?.role,
      application.id,
      application.company,
      application.roleTitle,
      application.status,
      application.appliedDate,
      application.jobLink,
      application.notes,
    ];
  });

  users.forEach((user) => {
    if (!applicationUsers.has(emailKey(user.email))) {
      rows.push([user.id, user.name, user.email, user.role, "", "", "", "", "", "", ""]);
    }
  });

  downloadCsv(
    `job-tracker-all-data-${dateStamp()}.csv`,
    toCsv(ALL_DATA_HEADERS, rows)
  );
}

export function downloadUsersCsv(users, applications) {
  const counts = new Map();
  applications.forEach((application) => {
    const key = emailKey(application.ownerEmail);
    if (key) counts.set(key, (counts.get(key) || 0) + 1);
  });
  const rows = users.map((user) => [
    user.id,
    user.name,
    user.email,
    user.role,
    counts.get(emailKey(user.email)) ?? user.applicationCount ?? 0,
  ]);

  downloadCsv(
    `job-tracker-users-${dateStamp()}.csv`,
    toCsv(USERS_HEADERS, rows)
  );
}
