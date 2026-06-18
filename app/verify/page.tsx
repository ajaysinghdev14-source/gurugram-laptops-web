"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { isAxiosError } from "axios";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error"
  );
  const [errorMessage, setErrorMessage] = useState(
    token ? "" : "No verification token provided."
  );

  useEffect(() => {
    if (!token) return;

    const verifyToken = async () => {
      try {
        await AuthService.verifyEmail(token);
        setStatus("success");
        toast.success("Email successfully verified!");
      } catch (error: unknown) {
        setStatus("error");
        let msg = "Failed to verify email.";
        if (isAxiosError(error)) {
          msg = error.response?.data?.message || msg;
        } else if (error instanceof Error) {
          msg = error.message;
        }
        setErrorMessage(msg);
      }
    };

    verifyToken();
  }, [token]);

  return (
    <Card className="w-full max-w-md mx-auto shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
        <CardDescription>
          We are verifying your email address
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6 gap-6">
        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-muted-foreground text-center">Please wait while we verify your token...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <p className="text-muted-foreground text-center">Your email has been verified! You can now access all features.</p>
            <Button className="w-full rounded-full" onClick={() => router.push("/")}>
              Go to Homepage
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-12 w-12 text-red-500" />
            <p className="text-red-500 text-center font-medium">{errorMessage}</p>
            <p className="text-muted-foreground text-center text-sm">The token might be expired or invalid. Please try registering again or contacting support.</p>
            <Button variant="outline" className="w-full rounded-full" onClick={() => router.push("/login")}>
              Back to Login
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <div className="container flex min-h-[calc(100vh-10rem)] items-center justify-center">
      <Suspense fallback={<Loader2 className="animate-spin h-8 w-8 text-primary" />}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
