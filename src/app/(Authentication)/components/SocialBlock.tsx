"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

export function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.08.72-2.46 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.94H1.28v3.1A12 12 0 0 0 12 24z"
      />
      <path fill="#FBBC05" d="M5.29 14.3a7.2 7.2 0 0 1 0-4.6v-3.1H1.28a12 12 0 0 0 0 10.8z" />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.6l4.01 3.1C6.23 6.86 8.88 4.75 12 4.75z"
      />
    </svg>
  );
}

declare global {
  interface Window {
    __googleGisInitialized?: boolean;
    __googleGisClientId?: string;
    __googleGisCallback?: (response: { credential: string }) => void;
    google?: {
      accounts?: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          prompt: (
            notification?: (notification: {
              isNotDisplayed: () => boolean;
              isSkippedMoment: () => boolean;
              isDismissedMoment: () => boolean;
              getDismissedReason: () => string;
              getNotDisplayedReason: () => string;
            }) => void,
          ) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
              width?: number | string;
            },
          ) => void;
        };
      };
    };
  }
}

export function SocialBlock() {
  const { loginWithGoogle } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Connecting to Google…");
  const [error, setError] = useState("");

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  // Reset loading if the user closes Google popup without selecting an account
  useEffect(() => {
    if (!loading) return;

    const handleWindowFocus = () => {
      // Give Google callback a 3-second grace period to execute after popup closure
      setTimeout(() => {
        setLoading((prev) => {
          if (prev && loadingMessage === "Connecting to Google…") {
            return false;
          }
          return prev;
        });
      }, 3000);
    };

    window.addEventListener("focus", handleWindowFocus);
    return () => window.removeEventListener("focus", handleWindowFocus);
  }, [loading, loadingMessage]);

  useEffect(() => {
    if (!clientId) return;

    const handleCredentialResponse = async (response: { credential: string }) => {
      if (response?.credential) {
        setLoading(true);
        setLoadingMessage("Signing you in to ViaScholar…");
        setError("");
        try {
          const user = await loginWithGoogle(response.credential);
          if (user.role === "SCHOLAR") {
            router.push("/scholardashboard");
          } else if (user.role === "APPLICANT") {
            router.push("/application-form");
          } else {
            router.push("/AdminDashboard");
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Google Sign-In failed.");
          setLoading(false);
        }
      }
    };

    // Update active callback reference for the global GIS handler
    window.__googleGisCallback = handleCredentialResponse;

    const setupGis = () => {
      if (!window.google?.accounts?.id) return;

      // Only initialize once globally across tab switches and route changes
      if (!window.__googleGisInitialized || window.__googleGisClientId !== clientId) {
        window.__googleGisInitialized = true;
        window.__googleGisClientId = clientId;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            window.__googleGisCallback?.(response);
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: false,
        });
      }

      // Render the button into current container whenever component mounts
      const btnContainer = document.getElementById("google-signin-btn-container");
      if (btnContainer) {
        btnContainer.innerHTML = "";
        window.google.accounts.id.renderButton(btnContainer, {
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "pill",
          logo_alignment: "left",
          width: 320,
        });
      }
    };

    if (window.google?.accounts?.id) {
      setupGis();
      return;
    }

    const existingScript = document.getElementById("google-gis-script") as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener("load", setupGis);
      return () => {
        existingScript.removeEventListener("load", setupGis);
      };
    }

    const script = document.createElement("script");
    script.id = "google-gis-script";
    script.src = "https://accounts.google.com/gsi/client?hl=en";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setupGis();
    };
    document.body.appendChild(script);
  }, [clientId, loginWithGoogle, router]);

  const handleManualGoogleClick = async () => {
    setLoading(true);
    setLoadingMessage("Connecting to Google…");
    setError("");

    // If GIS button is present inside container, trigger click on it
    const renderedBtn = document.querySelector("#google-signin-btn-container div[role=button]") as HTMLElement;
    if (renderedBtn) {
      renderedBtn.click();
      return;
    }

    if (window.google?.accounts?.id && clientId) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment() || notification.isDismissedMoment()) {
          setLoading(false);
          const simulatedEmail = window.prompt(
            "Google popup was dismissed. Enter Google Email to sign in directly:",
            "student.google@viascholar.org",
          );
          if (simulatedEmail) {
            setLoading(true);
            setLoadingMessage("Signing you in to ViaScholar…");
            loginWithGoogle(simulatedEmail)
              .then((user) => {
                if (user.role === "SCHOLAR") router.push("/scholardashboard");
                else if (user.role === "APPLICANT") router.push("/application-form");
                else router.push("/AdminDashboard");
              })
              .catch((err) => {
                setError(err.message);
                setLoading(false);
              });
          }
        }
      });
      return;
    }

    // Dev mode fallback prompt
    const simulatedEmail = window.prompt(
      "Enter Google Account Email for Sign-In / Registration:",
      "student.google@viascholar.org",
    );
    if (simulatedEmail) {
      setLoading(true);
      setLoadingMessage("Signing you in to ViaScholar…");
      try {
        const user = await loginWithGoogle(simulatedEmail);
        if (user.role === "SCHOLAR") {
          router.push("/scholardashboard");
        } else if (user.role === "APPLICANT") {
          router.push("/application-form");
        } else {
          router.push("/AdminDashboard");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Google login failed.");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-[0.8rem] font-medium text-muted-foreground">or continue with</span>
        <Separator className="flex-1" />
      </div>

      {error && <div className="rounded-lg bg-bad-bg px-3 py-2 text-xs font-medium text-bad">{error}</div>}

      {/* Styled English Full-Width Button matching Sign In button */}
      <div className="relative w-full overflow-hidden rounded-full">
        {/* Invisible Google GIS rendered button container overlay */}
        {!loading && (
          <div
            id="google-signin-btn-container"
            className="absolute inset-0 z-10 flex h-full w-full cursor-pointer items-center justify-center opacity-[0.001] [&>div]:w-full! [&>div]:h-full! [&>iframe]:w-full! [&>iframe]:h-full!"
          />
        )}

        {/* Visible Custom UI Button (100% English, Full Width) */}
        <Button
          type="button"
          variant="outline"
          onClick={handleManualGoogleClick}
          disabled={loading}
          className="h-10 w-full rounded-full text-[0.9rem] font-medium transition-all"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="size-4 animate-spin text-primary" />
              <span>{loadingMessage}</span>
            </span>
          ) : (
            <>
              <GoogleIcon />
              Continue with Google
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
