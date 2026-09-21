"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function AdminHeaderSkeleton({
  titleWidth = "w-44",
  subtitleWidth = "w-72",
}: {
  titleWidth?: string;
  subtitleWidth?: string;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-line bg-white px-6 py-3.5">
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-lg md:hidden" />
        <div className="space-y-1.5">
          <Skeleton className={`h-6 ${titleWidth} rounded-md`} />
          <Skeleton className={`h-3.5 ${subtitleWidth} rounded-md`} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="hidden h-9 w-48 rounded-full sm:block" />
        <Skeleton className="size-9 rounded-full" />
      </div>
    </header>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-[#FAF8F5]">
      <AdminHeaderSkeleton titleWidth="w-36" subtitleWidth="w-64" />
      <div className="space-y-6 p-6 md:p-8">
        {/* Quick Action Tiles */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
              key={i}
              className="flex items-center justify-between rounded-2xl border border-line bg-white p-5 shadow-xs"
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-3 w-20 rounded-md" />
              </div>
              <Skeleton className="size-10 rounded-full" />
            </div>
          ))}
        </div>

        {/* 3 KPI Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
              key={i}
              className="space-y-3 rounded-2xl border border-line bg-white p-5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>

        {/* Chart and Activity Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Chart Card */}
          <div className="space-y-4 rounded-2xl border border-line bg-white p-6 shadow-xs lg:col-span-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-48 rounded-md" />
              <Skeleton className="h-8 w-28 rounded-lg" />
            </div>
            <Skeleton className="h-56 w-full rounded-xl" />
          </div>

          {/* Activity Feed Card */}
          <div className="space-y-4 rounded-2xl border border-line bg-white p-6 shadow-xs">
            <Skeleton className="h-5 w-36 rounded-md" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
                  key={i}
                  className="flex items-center gap-3 border-b border-line/50 pb-3 last:border-none"
                >
                  <Skeleton className="size-9 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-full rounded-md" />
                    <Skeleton className="h-3 w-24 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MonitorSkeleton() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-[#FAF8F5]">
      <AdminHeaderSkeleton titleWidth="w-28" subtitleWidth="w-80" />
      <div className="space-y-6 p-6 md:p-8">
        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
              key={i}
              className="space-y-2 rounded-2xl border border-line bg-white p-4 shadow-xs"
            >
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <Skeleton className="h-7 w-16 rounded-md" />
            </div>
          ))}
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <Skeleton className="h-10 w-64 rounded-lg" />
            <Skeleton className="h-10 w-44 rounded-lg" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="rounded-2xl border border-line bg-white p-5 shadow-xs space-y-4">
          <div className="flex justify-between border-b border-line pb-3">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
              key={i}
              className="flex items-center justify-between gap-4 border-b border-line/60 py-3.5 last:border-none"
            >
              <div className="flex items-center gap-3 w-48">
                <Skeleton className="size-9 rounded-full shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-28 rounded-md" />
                  <Skeleton className="h-3 w-36 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-4 w-32 rounded-md hidden md:block" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-12 rounded-md hidden sm:block" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ArchiveSkeleton() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-[#FAF8F5]">
      <AdminHeaderSkeleton titleWidth="w-28" subtitleWidth="w-80" />
      <div className="space-y-6 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Skeleton className="h-10 w-72 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>

        <div className="rounded-2xl border border-line bg-white p-5 shadow-xs space-y-4">
          <div className="flex justify-between border-b border-line pb-3">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
              key={i}
              className="flex items-center justify-between gap-4 border-b border-line/60 py-3.5 last:border-none"
            >
              <div className="flex items-center gap-3 w-44">
                <Skeleton className="size-9 rounded-full shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-28 rounded-md" />
                  <Skeleton className="h-3 w-32 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-4 w-36 rounded-md hidden md:block" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-4 w-20 rounded-md hidden sm:block" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EmployeeSkeleton() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-[#FAF8F5]">
      <AdminHeaderSkeleton titleWidth="w-32" subtitleWidth="w-72" />
      <div className="space-y-6 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Skeleton className="h-10 w-72 rounded-lg" />
          <Skeleton className="h-10 w-40 rounded-full" />
        </div>

        <div className="rounded-2xl border border-line bg-white p-5 shadow-xs space-y-4">
          <div className="flex justify-between border-b border-line pb-3">
            <Skeleton className="h-4 w-36 rounded-md" />
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
              key={i}
              className="flex items-center justify-between gap-4 border-b border-line/60 py-3.5 last:border-none"
            >
              <div className="flex items-center gap-3 w-48">
                <Skeleton className="size-9 rounded-full shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-28 rounded-md" />
                  <Skeleton className="h-3 w-36 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-4 w-28 rounded-md hidden md:block" />
              <Skeleton className="h-4 w-28 rounded-md hidden sm:block" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MeetingSkeleton() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-[#FAF8F5]">
      <AdminHeaderSkeleton titleWidth="w-32" subtitleWidth="w-64" />
      <div className="space-y-6 p-6 md:p-8">
        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
              key={i}
              className="space-y-2 rounded-2xl border border-line bg-white p-5 shadow-xs"
            >
              <Skeleton className="h-3.5 w-28 rounded-md" />
              <Skeleton className="h-7 w-16 rounded-md" />
            </div>
          ))}
        </div>

        {/* Calendar and Meetings Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 rounded-2xl border border-line bg-white p-6 shadow-xs">
            <Skeleton className="h-6 w-36 rounded-md" />
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 28 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
                <Skeleton key={i} className="h-8 w-full rounded-md" />
              ))}
            </div>
          </div>
          <div className="space-y-4 rounded-2xl border border-line bg-white p-6 shadow-xs lg:col-span-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-44 rounded-md" />
              <Skeleton className="h-9 w-36 rounded-full" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-line/70 p-4"
                >
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-44 rounded-md" />
                    <Skeleton className="h-3 w-32 rounded-md" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ForumSkeleton() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-[#FAF8F5]">
      <AdminHeaderSkeleton titleWidth="w-24" subtitleWidth="w-64" />
      <div className="space-y-6 p-6 md:p-8">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-20 rounded-full" />
          </div>
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
              key={i}
              className="space-y-3.5 rounded-2xl border border-line bg-white p-6 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-36 rounded-md" />
                  <Skeleton className="h-3 w-24 rounded-md" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3.5 w-full rounded-md" />
                <Skeleton className="h-3.5 w-5/6 rounded-md" />
              </div>
              <div className="flex gap-4 pt-2 border-t border-line/50">
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-6 w-16 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PaymentSkeleton() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-[#FAF8F5]">
      <AdminHeaderSkeleton titleWidth="w-32" subtitleWidth="w-72" />
      <div className="space-y-6 p-6 md:p-8">
        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
              key={i}
              className="space-y-2 rounded-2xl border border-line bg-white p-5 shadow-xs"
            >
              <Skeleton className="h-3.5 w-28 rounded-md" />
              <Skeleton className="h-7 w-20 rounded-md" />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>

        <div className="rounded-2xl border border-line bg-white p-5 shadow-xs space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
              key={i}
              className="flex items-center justify-between gap-4 border-b border-line/60 py-3.5 last:border-none"
            >
              <div className="flex items-center gap-3 w-48">
                <Skeleton className="size-9 rounded-full shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-28 rounded-md" />
                  <Skeleton className="h-3 w-36 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-4 w-28 rounded-md hidden md:block" />
              <Skeleton className="h-5 w-20 rounded-md font-semibold" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReportsSkeleton() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-[#FAF8F5]">
      <AdminHeaderSkeleton titleWidth="w-40" subtitleWidth="w-72" />
      <div className="space-y-6 p-6 md:p-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
              key={i}
              className="space-y-2 rounded-2xl border border-line bg-white p-5 shadow-xs"
            >
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <Skeleton className="h-7 w-16 rounded-md" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-line bg-white p-6 shadow-xs">
            <Skeleton className="h-6 w-44 rounded-md" />
            <Skeleton className="h-52 w-full rounded-xl" />
          </div>
          <div className="space-y-4 rounded-2xl border border-line bg-white p-6 shadow-xs">
            <Skeleton className="h-6 w-44 rounded-md" />
            <Skeleton className="h-52 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MessageSkeleton() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#FAF8F5]">
      <AdminHeaderSkeleton titleWidth="w-28" subtitleWidth="w-64" />
      <div className="flex flex-1 overflow-hidden border-t border-line">
        {/* Left conversations pane */}
        <div className="w-80 border-r border-line bg-white p-4 space-y-3 hidden md:block">
          <Skeleton className="h-10 w-full rounded-lg mb-4" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
              key={i}
              className="flex items-center gap-3 p-2.5 rounded-xl border border-transparent"
            >
              <Skeleton className="size-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-3 w-40 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Right chat panel */}
        <div className="flex-1 flex flex-col justify-between bg-white/60 p-6">
          <div className="flex items-center gap-3 border-b border-line pb-4">
            <Skeleton className="size-10 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="h-3 w-20 rounded-md" />
            </div>
          </div>
          <div className="space-y-4 my-6">
            <div className="flex gap-3">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-16 w-64 rounded-2xl" />
            </div>
            <div className="flex gap-3 justify-end">
              <Skeleton className="h-12 w-56 rounded-2xl" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-20 w-80 rounded-2xl" />
            </div>
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-[#FAF8F5]">
      <AdminHeaderSkeleton titleWidth="w-28" subtitleWidth="w-72" />
      <div className="space-y-6 p-6 md:p-8 max-w-4xl">
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-xs space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
              key={i}
              className="flex items-center justify-between gap-4 border-b border-line/60 pb-5 last:border-none"
            >
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-44 rounded-md" />
                <Skeleton className="h-3.5 w-72 rounded-md" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-[#FAF8F5]">
      <AdminHeaderSkeleton titleWidth="w-28" subtitleWidth="w-64" />
      <div className="space-y-6 p-6 md:p-8 max-w-4xl">
        <div className="relative rounded-2xl overflow-hidden border border-line bg-white shadow-xs pb-6">
          <Skeleton className="h-48 w-full rounded-none" />
          <div className="px-6 -mt-12 flex flex-wrap items-end justify-between gap-4">
            <Skeleton className="size-24 rounded-full ring-4 ring-white" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
          <div className="px-6 mt-4 space-y-2">
            <Skeleton className="h-6 w-48 rounded-md" />
            <Skeleton className="h-4 w-36 rounded-md" />
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-xs space-y-4">
          <Skeleton className="h-5 w-36 rounded-md mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-11 w-full rounded-lg" />
            <Skeleton className="h-11 w-full rounded-lg" />
            <Skeleton className="h-11 w-full rounded-lg" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DefaultAdminSkeleton() {
  return <DashboardSkeleton />;
}
