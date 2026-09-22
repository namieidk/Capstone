"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSocketEvent } from "@/contexts/SocketContext";
import { ApiError } from "@/lib/api";
import {
  createSchoolGrading,
  deleteSchoolGrading,
  listSchoolGradings,
  type SchoolGrading,
  type SchoolGradingInput,
  updateSchoolGrading,
} from "@/lib/api/settings";
import { AddGradingSheet } from "./components/AddGradingSheet";
import { GradingHeader } from "./components/GradingHeader";
import { GradingSheet } from "./components/GradingSheet";
import { GradingTable } from "./components/GradingTable";

export default function GradingSystemsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [schools, setSchools] = useState<SchoolGrading[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<SchoolGrading | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const canDelete = user?.role === "ADMIN" || user?.role === "GRANTOR";

  const fetchGradings = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      setSchools(await listSchoolGradings());
    } catch (err) {
      console.error("Failed to load grading systems:", err);
      setLoadError(err instanceof ApiError ? err.message : "Failed to load grading systems.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGradings();
  }, [fetchGradings]);

  // Real-time updates for school grading system configurations
  useSocketEvent("school_grading:created", fetchGradings);
  useSocketEvent("school_grading:updated", fetchGradings);
  useSocketEvent("school_grading:deleted", fetchGradings);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q === "") return schools;
    return schools.filter(
      (s) =>
        s.school_name.toLowerCase().includes(q) ||
        s.grading_scale.toLowerCase().includes(q) ||
        (s.notes ?? "").toLowerCase().includes(q),
    );
  }, [schools, searchQuery]);

  async function handleCreate(input: SchoolGradingInput): Promise<void> {
    try {
      await createSchoolGrading(input);
      showToast("Grading system added successfully.");
      setShowAdd(false);
      await fetchGradings();
    } catch (err) {
      console.error("Failed to add grading system:", err);
      throw new Error(err instanceof ApiError ? err.message : "Failed to add grading system.");
    }
  }

  async function handleUpdate(id: number, input: Partial<SchoolGradingInput>): Promise<void> {
    try {
      await updateSchoolGrading(id, input);
      showToast("Grading system updated successfully.");
      await fetchGradings();
    } catch (err) {
      console.error("Failed to update grading system:", err);
      throw new Error(err instanceof ApiError ? err.message : "Failed to update grading system.");
    }
  }

  async function handleDelete(id: number): Promise<void> {
    try {
      await deleteSchoolGrading(id);
      showToast("Grading system removed successfully.");
      setSelected(null);

      await fetchGradings();
    } catch (err) {
      console.error("Failed to delete grading system:", err);
      throw new Error(err instanceof ApiError ? err.message : "Failed to delete grading system.");
    }
  }

  return (
    <div className="min-h-full bg-[#faf8f5]">
      <GradingHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAdd={() => setShowAdd(true)}
      />

      <div className="px-5 pb-24 md:px-10">
        <GradingTable
          schools={filtered}
          totalCount={schools.length}
          loading={loading}
          loadError={loadError}
          onRetry={fetchGradings}
          onSelect={setSelected}
        />
      </div>

      <GradingSheet
        school={selected}
        onClose={() => setSelected(null)}
        canDelete={canDelete}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />

      <AddGradingSheet open={showAdd} onOpenChange={setShowAdd} onCreate={handleCreate} />
    </div>
  );
}
