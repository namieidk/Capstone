"use client";

import { ArrowRight, KeyRound, Users } from "lucide-react";
import Link from "next/link";
import type { StaffRow } from "@/app/(Admin)/AdminEmployee/components/employee-helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AdminStaffOverviewCardProps {
  staff: StaffRow[];
  onOpenResetPassword: (employee: StaffRow) => void;
}

export function AdminStaffOverviewCard({ staff, onOpenResetPassword }: AdminStaffOverviewCardProps) {
  const displayedStaff = staff.slice(0, 5);

  return (
    <Card className="rounded-[16px]! border-line bg-white shadow-va-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-line gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="hidden sm:flex size-7 items-center justify-center rounded-lg bg-[#0a4f42]/10 text-[#0a4f42] shrink-0">
              <Users className="size-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-[15px] font-bold text-foreground truncate">Staff & Employee Access</h3>
              <p className="text-xs text-muted-foreground truncate sm:whitespace-normal">
                Active coordinators, grantors, and administrators.
              </p>
            </div>
          </div>
          <Link href="/AdminEmployee" className="shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-[#0a4f42] hover:bg-[#0a4f42]/10 gap-1.5 h-8 font-semibold"
            >
              <span>Manage All</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>

        <div className="mt-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="min-w-100 sm:min-w-0 divide-y divide-line">
            {displayedStaff.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">No employee accounts on file.</div>
            ) : (
              displayedStaff.map((member) => (
                <div
                  key={member.id}
                  className="py-2.5 flex items-center justify-between gap-3 -mx-2 px-2 rounded-lg hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="size-8 rounded-full bg-[#eef1f5] text-[#0a4f42] font-bold flex items-center justify-center text-xs shrink-0 border border-slate-200">
                      {member.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{member.name}</p>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground truncate">
                        <span>{member.title || member.type}</span>
                        {member.department && (
                          <>
                            <span>•</span>
                            <span className="truncate">{member.department}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Equal Size Role Badge */}
                    <Badge
                      variant="secondary"
                      className={`w-24 text-center justify-center text-[10px] py-0.5 font-bold tracking-tight shrink-0 ${
                        member.type === "Coordinator"
                          ? "bg-[#ddeee3] text-[#0a4f42]"
                          : member.type === "Grantor"
                            ? "bg-[#fceec4] text-[#8a6410]"
                            : "bg-[#eef1f5] text-slate-700"
                      }`}
                    >
                      {member.type}
                    </Badge>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onOpenResetPassword(member)}
                      className="h-7 px-2 text-[11px] text-slate-600 hover:text-foreground hover:bg-slate-100 gap-1 rounded-md"
                      title="Reset Password"
                    >
                      <KeyRound className="size-3 text-[#8a6410]" />
                      <span className="hidden sm:inline">Reset</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
