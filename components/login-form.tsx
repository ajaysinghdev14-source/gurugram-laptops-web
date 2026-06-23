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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { ShieldCheck, Truck, BadgeCheck } from "lucide-react";

// Define our validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(loginSchema as any),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      
      const response = await AuthService.login({
        email: data.email,
        password: data.password,
      });

      await initializeAuth();

      toast.success(response.message || "Welcome back!");
      router.push("/");
    } catch (error: unknown) {
      let errorMessage = "Failed to login. Please try again.";
      
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
          <form className="p-8 md:p-10 lg:p-12 flex flex-col justify-center" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Brand Header */}
              <div className="flex flex-col gap-3 mb-4">
                <div className="flex items-center mb-1">
                  <Image src="/images/logo/gurugram-it-network-logo.webp" alt="Gurugram IT NETWORKS" width={240} height={60} className="h-10 md:h-12 w-auto" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
                    Welcome back
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Login to your Gurugram IT Networks account
                  </p>
                </div>
              </div>

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

              {/* PASSWORD */}
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password" className="text-sm font-medium">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <PasswordInput 
                  id="password" 
                  className="h-11 rounded-lg border-border/60 bg-background transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  {...register("password")} 
                />
                {errors.password && <FieldDescription className="text-destructive text-xs">{errors.password.message}</FieldDescription>}
              </Field>

              {/* Submit Button */}
              <Field className="mt-2">
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
                      Logging in...
                    </span>
                  ) : (
                    "Login to Account"
                  )}
                </Button>
              </Field>

              {/* Signup Link */}
              <p className="text-center text-sm text-muted-foreground mt-2">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-medium text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline">
                  Sign up
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
              priority
              className="absolute inset-0 object-cover opacity-60"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.12_0.025_255)] via-transparent to-[oklch(0.12_0.025_255)/60%]" />
            
            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col justify-end h-full p-8 lg:p-10">
              {/* Trust Badges */}
              <div className="space-y-4">
                <h2 className="text-white font-heading text-xl lg:text-2xl font-bold leading-tight">
                  Welcome back to<br />
                  <span className="text-[oklch(0.715_0.143_195)]">Premium Tech.</span>
                </h2>
                <p className="text-white/70 text-sm leading-relaxed max-w-xs">
                  Access your orders, track deliveries, and manage your warranties.
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
      <div className="text-balance text-center text-xs text-muted-foreground px-6">
        By logging in, you agree to our{" "}
        <Link href="#" className="underline underline-offset-4 hover:text-primary transition-colors">Terms of Service</Link>
        {" "}and{" "}
        <Link href="#" className="underline underline-offset-4 hover:text-primary transition-colors">Privacy Policy</Link>.
      </div>
    </div>
  );
}
