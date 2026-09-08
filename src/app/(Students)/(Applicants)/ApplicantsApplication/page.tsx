"use client";

import { Bell, Check, Menu } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSidebar } from "@/components/SidebarContext";
import { useToast } from "@/components/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSocketEvent } from "@/contexts/SocketContext";
import { ApiError } from "@/lib/api";
import { type Application, createApplication, getMyApplication } from "@/lib/api/applications";
import {
  confirmDocument,
  deleteDocument,
  type GradeItem,
  getMyDocuments,
  replaceDocument,
  type ScholarDocument,
  uploadDocuments,
} from "@/lib/api/documents";
import type { ApplicationFormValues } from "@/lib/validation";
import { ApplicationStep } from "./components/ApplicationStep";
import { DocumentsStep } from "./components/DocumentsStep";
import { StatusStep } from "./components/StatusStep";
import { WizardSkeleton } from "./components/WizardSkeleton";
import { resolveStep, WIZARD_STEPS, type WizardStep } from "./components/wizard-helpers";

export default function ApplicantsApplicationPage() {
  const { toggleMobile } = useSidebar();
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [application, setApplication] = useState<Application | null>(null);
  const [documents, setDocuments] = useState<ScholarDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [step, setStep] = useState<WizardStep>(1);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const initializedRef = useRef(false);

  const changeStep = useCallback((target: WizardStep) => {
    setStep((prev) => {
      if (prev !== target) {
        setDirection(target > prev ? "forward" : "backward");
      }
      return target;
    });
  }, []);

  const refreshDocuments = useCallback(async () => {
    try {
      setDocuments(await getMyDocuments());
    } catch (err) {
      if (!(err instanceof ApiError && err.status === 404)) throw err;
      setDocuments([]);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [app, docs] = await Promise.all([
        getMyApplication().catch((err: unknown) => {
          if (err instanceof ApiError && err.status === 404) return null;
          throw err;
        }),
        getMyDocuments().catch((err: unknown) => {
          if (err instanceof ApiError && err.status === 404) return [];
          throw err;
        }),
      ]);
      setApplication(app);
      setDocuments(docs);
      if (!initializedRef.current) {
        setStep(resolveStep(app, docs));
        initializedRef.current = true;
      }
    } catch (err) {
      console.error("Failed to load application:", err);
      setLoadError(err instanceof ApiError ? err.message : "Failed to load your application.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Real-time lifecycle events for applicant application
  useSocketEvent("document:changes_requested", fetchAll);
  useSocketEvent("document:verified", fetchAll);
  useSocketEvent("application:stage_updated", fetchAll);
  useSocketEvent("interview:scheduled", fetchAll);
  useSocketEvent("interview:rescheduled", fetchAll);
  useSocketEvent("interview:cancelled", fetchAll);

  const prefill = useMemo(() => {
    const p = user?.scholar_profile;
    return {
      scholarship_track: p?.scholarship_track ?? "",
      student_number: p?.student_number ?? "",
      student_address: p?.student_address ?? "",
      course_of_study: p?.course_of_study ?? "",
      school_name: p?.school_name ?? "",
      school_address: p?.school_address ?? "",
      phone_number: p?.phone_number ?? "",
      relative_employee: p?.relative_employee ?? "",
    };
  }, [user]);

  async function wrapAction(fn: () => Promise<void>, success: string): Promise<void> {
    try {
      await fn();
      showToast(success);
    } catch (err) {
      console.error(success, err);
      throw new Error(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  }

  async function handleSubmitApplication(values: ApplicationFormValues): Promise<void> {
    await wrapAction(async () => {
      await createApplication({
        scholarship_track: values.scholarship_track,
        student_number: values.student_number,
        student_address: values.student_address,
        course_of_study: values.course_of_study,
        school_name: values.school_name,
        school_address: values.school_address,
        ...(values.phone_number ? { phone_number: values.phone_number } : {}),
        ...(values.relative_employee ? { relative_employee: values.relative_employee } : {}),
      });
      // The backend upserts the scholar profile on submit — pull the fresh
      // profile so step 1 repopulates when the applicant comes back.
      await refreshUser();
      await fetchAll();
      changeStep(2);
    }, "Application submitted.");
  }

  async function handleUpload(files: File[], type: string): Promise<void> {
    await wrapAction(async () => {
      await uploadDocuments(files, type);
      await refreshDocuments();
    }, "Documents uploaded.");
  }

  async function handleReplace(id: number, files: File[]): Promise<void> {
    await wrapAction(async () => {
      await replaceDocument(id, files);
      await refreshDocuments();
    }, "Document replaced.");
  }

  async function handleDelete(id: number): Promise<void> {
    await wrapAction(async () => {
      await deleteDocument(id);
      await refreshDocuments();
    }, "Document deleted.");
  }

  async function handleConfirm(
    id: number,
    data?: {
      academic_year?: string;
      general_average?: number;
      grade_items?: GradeItem[];
    },
  ): Promise<void> {
    await wrapAction(async () => {
      await confirmDocument(id, data ?? {});
      await refreshDocuments();
    }, "Document confirmed.");
  }

  function goTo(target: WizardStep) {
    if (target === 1 || application) changeStep(target);
  }

  if (loading) {
    return <WizardSkeleton />;
  }

  return (
    <div>
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-white px-5 py-3.5">
        <div className="flex min-w-0 items-center">
          <button
            type="button"
            className="vd-mobile-toggle mr-2 shrink-0 md:hidden"
            onClick={toggleMobile}
            aria-label="Open sidebar"
          >
            <Menu className="size-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-navy">Application</h1>
            <p className="truncate text-sm text-muted-foreground">Apply in 3 quick steps.</p>
          </div>
        </div>
        <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
          <Bell className="size-4 text-navy" />
          <span className="absolute top-2 right-2 size-1.75 rounded-full border-2 border-muted bg-amber" />
        </span>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-6">
        {loadError ? (
          <div className="flex flex-col items-center gap-4 rounded-[18px]! border border-border bg-white px-6 py-14 text-center shadow-xs">
            <p className="text-base font-semibold text-navy">Could not load your application</p>
            <p className="text-sm text-muted-foreground">{loadError}</p>
            <button type="button" onClick={fetchAll} className="h-11 rounded-lg px-5 text-sm! font-medium shadow-xs">
              Try again
            </button>
          </div>
        ) : (
          <>
            <ol className="flex items-start rounded-[18px]! border border-border bg-white p-4 shadow-xs">
              {WIZARD_STEPS.map((s, i) => {
                const done = s.step < step;
                const active = s.step === step;
                const unlocked = s.step === 1 || application !== null;
                return (
                  <li key={s.step} className="flex flex-1 items-start last:flex-none">
                    <button
                      type="button"
                      onClick={() => goTo(s.step)}
                      disabled={!unlocked}
                      aria-current={active ? "step" : undefined}
                      className={`flex flex-col items-center gap-1.5 rounded-lg px-1 ${unlocked ? "cursor-pointer" : "cursor-default opacity-60"}`}
                    >
                      <span
                        className={`flex size-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 transform ${
                          done
                            ? "bg-navy text-white shadow-xs"
                            : active
                              ? "bg-amber! text-navy! ring-4 ring-amber/25 scale-105 shadow-xs"
                              : "bg-muted text-muted-foreground scale-95"
                        }`}
                      >
                        {done ? (
                          <Check className="size-4 animate-in zoom-in-50 duration-200" />
                        ) : (
                          <span className="tabular-nums">{s.step}</span>
                        )}
                      </span>
                      <span className="flex flex-col items-center">
                        <span
                          className={`text-xs transition-colors duration-200 ${active || done ? "font-semibold text-navy" : "text-muted-foreground"}`}
                        >
                          {s.label}
                        </span>
                        <span className="hidden text-[0.7rem] text-muted-foreground sm:block">{s.sub}</span>
                      </span>
                    </button>
                    {i < WIZARD_STEPS.length - 1 && (
                      <div className="mx-1 mt-4 h-1 flex-1 overflow-hidden rounded-full bg-border/70">
                        <div
                          className="h-full bg-navy transition-all duration-500 ease-out"
                          style={{ width: s.step < step ? "100%" : "0%" }}
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>

            <div
              key={step}
              className={`w-full ${direction === "forward" ? "animate-step-forward" : "animate-step-backward"}`}
            >
              {step === 1 && (
                <ApplicationStep
                  prefill={prefill}
                  hasApplication={application !== null}
                  onSubmit={handleSubmitApplication}
                />
              )}
              {step === 2 && (
                <DocumentsStep
                  documents={documents}
                  onUpload={handleUpload}
                  onReplace={handleReplace}
                  onDelete={handleDelete}
                  onConfirm={handleConfirm}
                  onContinue={() => changeStep(3)}
                  hasConfirmed={documents.some((d) => d.status === "STUDENT_CONFIRMED" || d.status === "VERIFIED")}
                />
              )}
              {step === 3 && (
                <StatusStep application={application} documents={documents} onBackToDocuments={() => changeStep(2)} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
