"use client";

import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { SocketContext } from "@/contexts/SocketContext";
import { getMyBaseline, type ScholarBaselineState } from "@/lib/api/baseline";
import { OnboardingSkeleton } from "./components/OnboardingSkeleton";
import { OnboardingStepper } from "./components/OnboardingStepper";
import { OnboardingTopNav } from "./components/OnboardingTopNav";
import { Step1SchoolSelection } from "./components/Step1SchoolSelection";
import { Step2ProspectusUpload } from "./components/Step2ProspectusUpload";
import { Step3CreditsReview } from "./components/Step3CreditsReview";
import { Step4FinalReview } from "./components/Step4FinalReview";

const isHigherEducationSchool = (school?: { school_name?: string; grading_scale?: string } | null) => {
  if (!school) return false;
  if (/high\s*school|senior\s*high|deped/i.test(school.school_name || "")) return false;
  if (school.grading_scale === "PERCENTAGE_100") return false;
  return true;
};

export default function ScholarOnboardingPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const { socket } = useContext(SocketContext);

  const [data, setData] = useState<ScholarBaselineState | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Background data refresh (does NOT clobber currentStep)
  const refreshBaselineData = useCallback(async () => {
    try {
      const res = await getMyBaseline();
      setData(res);
      if (res.academic_baseline_status === "BASELINE_FROZEN") {
        router.replace("/scholardashboard");
        return res;
      }
      if (res.academic_baseline_status === "PENDING_COORDINATOR_REVIEW") {
        setSubmitted(true);
      }
      return res;
    } catch (err) {
      console.error("Failed to refresh baseline data:", err);
      return null;
    }
  }, [router]);

  // One-time initial mount resolution of current starting step
  const initializeBaseline = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getMyBaseline();
      setData(res);

      if (res.academic_baseline_status === "BASELINE_FROZEN") {
        router.replace("/scholardashboard");
        return;
      }

      if (res.academic_baseline_status === "PENDING_COORDINATOR_REVIEW") {
        setSubmitted(true);
        setCurrentStep(4);
      } else if (res.prospectus?.subjects && res.prospectus.subjects.length > 0) {
        setCurrentStep(3);
      } else if (isHigherEducationSchool(res.school_grading_system)) {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    } catch (err) {
      console.error("Failed to initialize baseline state:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    initializeBaseline();
  }, [initializeBaseline]);

  // Real-time socket events
  useEffect(() => {
    if (!socket) return;

    const handleRefresh = () => {
      refreshBaselineData();
    };

    socket.on("baseline:prospectus_processed", handleRefresh);
    socket.on("baseline:frozen", () => {
      router.push("/scholardashboard");
    });
    socket.on("baseline:submitted_for_review", handleRefresh);

    return () => {
      socket.off("baseline:prospectus_processed", handleRefresh);
      socket.off("baseline:frozen", handleRefresh);
      socket.off("baseline:submitted_for_review", handleRefresh);
    };
  }, [socket, refreshBaselineData, router]);

  // Max accessible step computation
  const hasHigherEdSchool = isHigherEducationSchool(data?.school_grading_system);
  const hasProspectus = !!data?.prospectus?.subjects && data.prospectus.subjects.length > 0;
  const maxAccessibleStep = hasProspectus ? 4 : hasHigherEdSchool ? 2 : 1;

  const handleStep1Success = async () => {
    await refreshBaselineData();
    setCurrentStep(2);
  };

  const handleStep2Success = async () => {
    await refreshBaselineData();
    setCurrentStep(3);
  };

  const handleStep3Success = async () => {
    await refreshBaselineData();
    setCurrentStep(4);
  };

  const handleStep4Success = async () => {
    await refreshUser();
    setSubmitted(true);
    await refreshBaselineData();
  };

  const handleGoToDashboard = async () => {
    await refreshUser();
    router.push("/scholardashboard");
  };

  if (loading && !data) {
    return <OnboardingSkeleton />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5]">
      {/* 1. Distraction-Free Top Navigation with Landing Page Logo */}
      <OnboardingTopNav />

      {/* 2. Main Onboarding Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {submitted || data?.academic_baseline_status === "PENDING_COORDINATOR_REVIEW" ? (
          /* Submission Complete / Pending Review View */
          <div className="p-8 sm:p-10 rounded-3xl border border-good/20 bg-white text-center space-y-4 shadow-sm">
            <div className="size-16 rounded-full bg-good-bg text-good flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle className="size-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-navy tracking-tight">Academic Baseline Submitted!</h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                Your curriculum evaluation checklist has been queued for your Academic Coordinator to review and freeze.
              </p>
            </div>
            <div className="pt-2">
              <Button
                type="button"
                onClick={handleGoToDashboard}
                className="h-11 px-8 rounded-xl bg-navy hover:bg-navy/90 text-white font-bold text-xs sm:text-sm shadow-md"
              >
                Go to Scholar Dashboard →
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* 3. Progress Stepper matching ApplicantsApplication style */}
            <OnboardingStepper
              currentStep={currentStep}
              onStepClick={setCurrentStep}
              maxAccessibleStep={maxAccessibleStep}
            />

            {/* 4. Active Step Content Card */}
            <div className="rounded-3xl border border-border bg-white p-6 sm:p-8 shadow-xs">
              {currentStep === 1 && (
                <Step1SchoolSelection currentSchool={data?.school_grading_system} onSuccess={handleStep1Success} />
              )}

              {currentStep === 2 && (
                <Step2ProspectusUpload
                  existingProspectus={data?.prospectus}
                  onSuccess={handleStep2Success}
                  onBack={() => setCurrentStep(1)}
                />
              )}

              {currentStep === 3 && (
                <Step3CreditsReview
                  prospectus={data?.prospectus}
                  currentYearLevel={data?.current_year_level}
                  onSuccess={handleStep3Success}
                  onBack={() => setCurrentStep(2)}
                />
              )}

              {currentStep === 4 && data && (
                <Step4FinalReview data={data} onSuccess={handleStep4Success} onBack={() => setCurrentStep(3)} />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
