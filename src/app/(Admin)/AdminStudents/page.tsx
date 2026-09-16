"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ToastContext";
import { useSocketEvent } from "@/contexts/SocketContext";
import { ApiError } from "@/lib/api";
import { requestPasswordReset } from "@/lib/api/auth";
import { listUsers, resetPassword, updateUserStatus } from "@/lib/api/users";
import { StudentDrawer } from "./components/StudentDrawer";
import { StudentHeader } from "./components/StudentHeader";
import { StudentResetPasswordDialog } from "./components/StudentResetPasswordDialog";
import { StudentTable } from "./components/StudentTable";
import { type StudentFilter, type StudentRow, toStudentRow } from "./components/student-helpers";

export default function AdminStudentsPage() {
  const { showToast } = useToast();

  const [filter, setFilter] = useState<StudentFilter>("All");
  const [selected, setSelected] = useState<StudentRow | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [acting, setActing] = useState(false);
  const [actionError, setActionError] = useState("");

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const users = await listUsers({ roles: "APPLICANT,SCHOLAR" });
      setStudents(users.map(toStudentRow));
      setPage(1);
    } catch (err) {
      console.error("Failed to load students:", err);
      setLoadError(err instanceof ApiError ? err.message : "Failed to load students.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Real-time socket events
  useSocketEvent("user:created", fetchStudents);
  useSocketEvent("user:status_updated", fetchStudents);
  useSocketEvent("user:password_reset", fetchStudents);

  const filtered = students.filter((s) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesType =
      filter === "All" ||
      (filter === "Scholars" && s.type === "Scholar") ||
      (filter === "Applicants" && s.type === "Applicant");

    const matchesSearch =
      q === "" ||
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.university?.toLowerCase().includes(q) ||
      s.degree?.toLowerCase().includes(q);

    return matchesType && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const counts: Record<StudentFilter, number> = {
    All: students.length,
    Scholars: students.filter((s) => s.type === "Scholar").length,
    Applicants: students.filter((s) => s.type === "Applicant").length,
  };

  const handleDirectResetPassword = async (studentId: number, newPass: string) => {
    setActing(true);
    setActionError("");
    try {
      await resetPassword(studentId, newPass);
      showToast("Student password updated successfully.");
    } catch (err) {
      console.error("Failed to reset password:", err);
      setActionError(err instanceof ApiError ? err.message : "Failed to reset password.");
    } finally {
      setActing(false);
    }
  };

  const handleSendResetEmail = async (email: string) => {
    setActing(true);
    setActionError("");
    try {
      await requestPasswordReset(email);
      showToast("Password reset email sent successfully.");
    } catch (err) {
      console.error("Failed to send reset email:", err);
      setActionError(err instanceof ApiError ? err.message : "Failed to send reset email.");
    } finally {
      setActing(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!selected) return;
    const target = !selected.user.is_active;
    setActing(true);
    setActionError("");
    try {
      await updateUserStatus(selected.id, target);
      showToast(target ? "Student account activated." : "Student account deactivated.");
      setSelected(null);
      await fetchStudents();
    } catch (err) {
      console.error("Failed to update student status:", err);
      setActionError(err instanceof ApiError ? err.message : "Failed to update student status.");
    } finally {
      setActing(false);
    }
  };

  const closeDrawer = () => {
    setSelected(null);
    setActionError("");
  };

  return (
    <div className="min-h-full bg-[#faf8f5]">
      <StudentHeader
        searchQuery={searchQuery}
        onSearchChange={(v) => {
          setSearchQuery(v);
          setPage(1);
        }}
      />

      <div className="px-5 pb-24 md:px-10">
        <StudentTable
          students={paginated}
          totalFiltered={filtered.length}
          loading={loading}
          loadError={loadError}
          onRetry={fetchStudents}
          filter={filter}
          counts={counts}
          onFilterChange={(f) => {
            setFilter(f);
            setPage(1);
          }}
          onSelect={setSelected}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <StudentDrawer
        student={selected}
        open={selected !== null && !resetDialogOpen}
        onOpenChange={(open) => !open && closeDrawer()}
        onOpenResetPassword={() => setResetDialogOpen(true)}
        onToggleStatus={handleToggleStatus}
        acting={acting}
        actionError={actionError}
      />

      <StudentResetPasswordDialog
        student={selected}
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        onDirectReset={handleDirectResetPassword}
        onSendResetEmail={handleSendResetEmail}
        acting={acting}
        actionError={actionError}
      />
    </div>
  );
}
