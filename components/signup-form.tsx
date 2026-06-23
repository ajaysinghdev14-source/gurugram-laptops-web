"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordStrength } from "@/components/password-strength";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { AuthService } from "@/services/auth.service";
import { isPasswordStrongEnough } from "@/lib/password";
import { Laptop, ShieldCheck, Truck, BadgeCheck } from "lucide-react";

// Define our validation schema (Mirroring the backend)
const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine(isPasswordStrongEnough, {
      message: "Password is too weak. Include uppercase, lowercase, numbers, or special characters.",
    }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(signupSchema as any),
  });

  const passwordValue = watch("password", "");

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setIsLoading(true);
      await AuthService.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });

      toast.success("Account created! Please log in.");
      router.push("/login");
    } catch (error: unknown) {
      let errorMessage = "Failed to create account. Please try again.";
      
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Main Card — Full-width split layout */}
      <div className="overflow-hidden rounded-2xl shadow-2xl shadow-primary/10 border border-border/50 bg-card">
        <div className="grid md:grid-cols-2">
          
          {/* ─── Left: Form ─── */}
          <form className="p-8 md:p-10 lg:p-12" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Brand Header */}
              <div className="flex flex-col gap-3 mb-2">
                <div className="flex items-center mb-1">
                  <Image src="/images/logo/gurugram-it-networks-logo.webp" alt="Gurugram IT NETWORKS" width={400} height={100} className="w-48 md:w-56 h-auto" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
                    Create your account
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Join thousands who save on premium refurbished laptops
                  </p>
                </div>
              </div>

              {/* FULL NAME */}
              <Field>
                <FieldLabel htmlFor="fullName" className="text-sm font-medium">Full Name</FieldLabel>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Ajay Singh"
                  className="h-11 rounded-lg border-border/60 bg-background transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  {...register("fullName")}
                />
                {errors.fullName && <FieldDescription className="text-destructive text-xs">{errors.fullName.message}</FieldDescription>}
              </Field>

              {/* EMAIL */}
              <Field>
                <FieldLabel htmlFor="email" className="text-sm font-medium">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="h-11 rounded-lg border-border/60 bg-background transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  {...register("email")}
                />
                {errors.email && <FieldDescription className="text-destructive text-xs">{errors.email.message}</FieldDescription>}
              </Field>

              {/* Password Row */}
              <Field>
                <Field className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* PASSWORD */}
                  <Field>
                    <FieldLabel htmlFor="password" className="text-sm font-medium">Password</FieldLabel>
                    <PasswordInput
                      id="password"
                      className="h-11 rounded-lg border-border/60 bg-background transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      {...register("password")}
                    />
                    {errors.password && <FieldDescription className="text-destructive text-xs">{errors.password.message}</FieldDescription>}
                  </Field>

                  {/* CONFIRM PASSWORD */}
                  <Field>
                    <FieldLabel htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm Password
                    </FieldLabel>
                    <PasswordInput
                      id="confirmPassword"
                      className="h-11 rounded-lg border-border/60 bg-background transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && <FieldDescription className="text-destructive text-xs">{errors.confirmPassword.message}</FieldDescription>}
                  </Field>
                </Field>

                {/* Password Strength Meter */}
                <PasswordStrength password={passwordValue} />
              </Field>

              {/* Submit Button */}
              <Field>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-lg font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Field>

              {/* Signin Link */}
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline">
                  Sign in
                </Link>
              </p>
            </FieldGroup>
          </form>
          
          {/* ─── Right: Hero Image + Trust Badges ─── */}
          <div className="relative hidden md:flex flex-col overflow-hidden bg-gradient-to-br from-[oklch(0.15_0.025_255)] to-[oklch(0.20_0.030_240)]">
            {/* Background Image */}
            <Image
              src="/signup-hero.png"
              alt="Premium refurbished laptop"
              fill
              className="absolute inset-0 object-cover opacity-60"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.12_0.025_255)] via-transparent to-[oklch(0.12_0.025_255)/60%]" />
            
            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col justify-end h-full p-8 lg:p-10">
              {/* Trust Badges */}
              <div className="space-y-4">
                <h2 className="text-white font-heading text-xl lg:text-2xl font-bold leading-tight">
                  Premium laptops.<br />
                  <span className="text-[oklch(0.715_0.143_195)]">Unbeatable prices.</span>
                </h2>
                <p className="text-white/70 text-sm leading-relaxed max-w-xs">
                  Every device is professionally inspected, certified, and backed by our quality guarantee.
                </p>
                
                {/* Feature Pills */}
                <div className="flex flex-col gap-2.5 pt-2">
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <ShieldCheck className="h-4 w-4 text-[oklch(0.715_0.143_195)]" />
                    </div>
                    <span className="text-sm font-medium">12-Month Warranty Included</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <BadgeCheck className="h-4 w-4 text-[oklch(0.715_0.143_195)]" />
                    </div>
                    <span className="text-sm font-medium">Certified & Quality Tested</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <Truck className="h-4 w-4 text-[oklch(0.715_0.143_195)]" />
                    </div>
                    <span className="text-sm font-medium">Free Delivery Across India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms Footer */}
      <p className="px-6 text-center text-xs text-muted-foreground">
        By creating an account, you agree to our{" "}
        <Link href="#" className="underline underline-offset-4 hover:text-primary transition-colors">Terms of Service</Link>
        {" "}and{" "}
        <Link href="#" className="underline underline-offset-4 hover:text-primary transition-colors">Privacy Policy</Link>.
      </p>
    </div>
  );
}
