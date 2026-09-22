"use client";

import { useMemo, useState } from "react";
import type { ArchivedScholar } from "@/components/Coordinatorshared";
import { ARCHIVED_SCHOLARS } from "@/components/Coordinatorshared";
import type { HeaderFilterProps } from "@/components/PageHeader";
import { ArchivedScholarDrawer } from "./components/Archivescholardrawer";
import { ArchivedScholarsTab } from "./components/Archivedscholarstab";
import { CoordinatorArchiveHeader } from "./components/Coordinatorarchiveheader";

const ARCHIVE_STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "All statuses", value: "ALL" },
  { label: "Graduated", value: "Graduated" },
  { label: "Terminated", value: "Terminated" },
  { label: "Withdrawn", value: "Withdrawn" },
];

export default function ArchivePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Selection & drawer state
  const [selectedScholar, setSelectedScholar] = useState<ArchivedScholar | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  // Swap this for real loading/error state once the archive list is wired
  // to an API — ArchivedScholarsTab already accepts loading/loadError/onRetry.
  const loading = false;

  const counts = useMemo(
    () => ({
      ALL: ARCHIVED_SCHOLARS.length,
      Graduated: ARCHIVED_SCHOLARS.filter((a) => a.status === "Graduated").length,
      Terminated: ARCHIVED_SCHOLARS.filter((a) => a.status === "Terminated").length,
      Withdrawn: ARCHIVED_SCHOLARS.filter((a) => a.status === "Withdrawn").length,
    }),
    [],
  );

  const headerFilter: HeaderFilterProps = useMemo(
    () => ({
      value: statusFilter,
      onChange: setStatusFilter,
      label: "Status",
      hasActive: statusFilter !== "ALL",
      onClear: () => setStatusFilter("ALL"),
      options: ARCHIVE_STATUS_OPTIONS.map((opt) => ({
        ...opt,
        label: `${opt.label} (${counts[opt.value as keyof typeof counts]})`,
      })),
    }),
    [statusFilter, counts],
  );

  return (
    <div className="min-h-full bg-[#faf8f5]">
      <CoordinatorArchiveHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} filter={headerFilter} />

      <div className="px-5 pt-4 pb-24 md:px-10 space-y-4">
        <ArchivedScholarsTab
          scholars={ARCHIVED_SCHOLARS}
          loading={loading}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onSelectScholar={(a) => {
            setSelectedScholar(a);
            setOpenDrawer(true);
          }}
        />
      </div>

      <ArchivedScholarDrawer scholar={selectedScholar} open={openDrawer} onOpenChange={setOpenDrawer} />
    </div>
  );
}