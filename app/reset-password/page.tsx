"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordStrength } from "@/components/password-strength";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Loader2, KeyRound } from "lucide-react";
import Link from "next/link";
import { isAxiosError } from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { isPasswordStrongEnough } from "@/lib/password";

const resetSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine(isPasswordStrongEnough, {
      message: "Password is too weak. Include uppercase, lowercase, numbers, or special characters.",
    }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetFormValues = z.infer<typeof resetSchema>;

function ResetPasswordContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(resetSchema as any),
  });

  const passwordValue = watch("password", "");

  if (!token) {
    return (
      <Card className="w-full max-w-md shadow-sm">
        <CardContent className="flex flex-col items-center p-8 gap-4 text-center">
          <KeyRound className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">Invalid Reset Link</h3>
          <p className="text-muted-foreground">This password reset link is missing or invalid. Please request a new one.</p>
          <Link href="/forgot-password" className="w-full mt-4">
            <Button className="w-full rounded-full">Request New Link</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const onSubmit = async (data: ResetFormValues) => {
    try {
      setIsLoading(true);
      await AuthService.resetPassword(token, data.password);
      setIsSuccess(true);
      toast.success("Password reset successfully! You can now log in.");
    } catch (error: unknown) {
      let errorMessage = "Failed to reset password. Please try again.";
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create New Password</CardTitle>
        <CardDescription>
          Enter your new password below to regain access to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-2">
              <KeyRound className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium">Password Updated!</h3>
            <p className="text-sm text-muted-foreground">
              Your password has been successfully reset. You can now use your new password to log in.
            </p>
            <Button className="w-full rounded-full mt-4" onClick={() => router.push("/login")}>
              Go to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="password">New Password</FieldLabel>
                <PasswordInput id="password" {...register("password")} />
                {errors.password && <FieldDescription className="text-red-500">{errors.password.message}</FieldDescription>}
                <PasswordStrength password={passwordValue} />
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                <PasswordInput id="confirmPassword" {...register("confirmPassword")} />
                {errors.confirmPassword && <FieldDescription className="text-red-500">{errors.confirmPassword.message}</FieldDescription>}
              </Field>

              <Button type="submit" disabled={isLoading} className="w-full rounded-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset Password
              </Button>
            </FieldGroup>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="container flex min-h-[calc(100vh-10rem)] items-center justify-center">
      <Suspense fallback={<Loader2 className="animate-spin h-8 w-8 text-primary" />}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
