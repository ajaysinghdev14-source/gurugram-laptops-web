"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";
import { AlertTriangle, X, Mail, Loader2 } from "lucide-react";

export function EmailVerificationBanner() {
  const { user, isInitialized } = useAuthStore();
  const [dismissed, setDismissed] = useState(false);
  const [resending, setResending] = useState(false);

  // Don't show if: not initialized, no user, email is verified, or user dismissed the banner
  if (!isInitialized || !user || user.isEmailVerified || dismissed) {
    return null;
  }

  const handleResendVerification = async () => {
    try {
      setResending(true);
      await AuthService.resendVerificationEmail();
      toast.success("Verification email sent! Please check your inbox.");
    } catch {
      toast.error("Failed to resend verification email. Please try again later.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative bg-amber-500/10 border-b border-amber-500/20">
      <div className="container mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <Mail className="h-4 w-4 shrink-0" />
        </div>
        <p className="text-amber-800 dark:text-amber-300 font-medium">
          Your email is not verified.{" "}
          <span className="text-amber-600 dark:text-amber-400 font-normal">
            Please check your inbox for the verification link.
          </span>
        </p>
        <button
          onClick={handleResendVerification}
          disabled={resending}
          className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3.5 py-1 text-xs font-semibold text-white hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {resending ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Sending...
            </>
          ) : (
            "Resend Email"
          )}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-amber-500/70 hover:text-amber-700 hover:bg-amber-500/10 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
