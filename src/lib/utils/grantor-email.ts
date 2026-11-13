export interface GrantorEmailParams {
  grantorEmail?: string | null;
  coordinatorEmail?: string | null;
  scholarName?: string | null;
  studentNumber?: string | null;
  courseOfStudy?: string | null;
  academicYear?: string | null;
  semester?: string | null;
  gwa?: number | string | null;
}

export function buildGrantorAppealEmailLinks(params: GrantorEmailParams) {
  const grantorEmail = (params.grantorEmail || "grantor@viascholar.com").trim();
  const coordinatorEmail = (params.coordinatorEmail || "coordinator@viascholar.com").trim();
  const scholarName = (params.scholarName || "Scholar").trim();
  const studentNumber = params.studentNumber?.trim() || "";
  const courseOfStudy = params.courseOfStudy?.trim() || "N/A";
  const academicYear = params.academicYear?.trim() || "Latest Term";
  const semester = params.semester?.trim() || "";
  const termLabel = semester ? `${academicYear} (${semester})` : academicYear;
  const formattedGwa =
    typeof params.gwa === "number"
      ? params.gwa.toFixed(2)
      : params.gwa != null && String(params.gwa).trim() !== "" && !Number.isNaN(Number(params.gwa))
        ? Number(params.gwa).toFixed(2)
        : "—";

  const subject = `[ViaScholar] Direct Reconsideration Request - ${scholarName} (${studentNumber || "Scholar"})`;
  const body = [
    "Dear Scholarship Grantor,",
    "",
    `I am writing to respectfully request a direct reconsideration of my scholarship status following my academic performance in ${termLabel}, where my General Weighted Average (GWA) was ${formattedGwa}.`,
    "",
    "Scholar Details:",
    `- Name: ${scholarName}`,
    `- Student ID: ${studentNumber || "N/A"}`,
    `- Program: ${courseOfStudy}`,
    `- Term & GWA: ${termLabel} — ${formattedGwa}`,
    "",
    "Reason for Reconsideration & Action Plan:",
    "[Please describe the circumstances that affected your grades and your concrete plan to recover your academic standing]",
    "",
    "Thank you very much for your time, kindness, and consideration.",
    "",
    "Respectfully yours,",
    scholarName,
  ].join("\n");

  const encodedTo = encodeURIComponent(grantorEmail);
  const encodedCc = encodeURIComponent(coordinatorEmail);
  const encodedSu = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  return {
    grantorEmail,
    coordinatorEmail,
    subject,
    body,
    gmailUrl: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&cc=${encodedCc}&su=${encodedSu}&body=${encodedBody}`,
    mailtoUrl: `mailto:${encodedTo}?cc=${encodedCc}&subject=${encodedSu}&body=${encodedBody}`,
  };
}

