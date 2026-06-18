"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      // Call our API Layer!
      const response = await AuthService.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });

      // Show success toast
      toast.success("Account created! Please log in.");

      // Our backend doesn't return tokens on register, so we redirect to login
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
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Enter your details below to create your account
                </p>
              </div>

              {/* FULL NAME */}
              <Field>
                <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  {...register("fullName")}
                />
                {errors.fullName && <FieldDescription className="text-red-500">{errors.fullName.message}</FieldDescription>}
              </Field>

              {/* EMAIL */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && <FieldDescription className="text-red-500">{errors.email.message}</FieldDescription>}
              </Field>

              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  {/* PASSWORD */}
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <PasswordInput id="password" {...register("password")} />
                    {errors.password && <FieldDescription className="text-red-500 text-xs">{errors.password.message}</FieldDescription>}
                  </Field>

                  {/* CONFIRM PASSWORD */}
                  <Field>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm Password
                    </FieldLabel>
                    <PasswordInput id="confirmPassword" {...register("confirmPassword")} />
                    {errors.confirmPassword && <FieldDescription className="text-red-500 text-xs">{errors.confirmPassword.message}</FieldDescription>}
                  </Field>
                </Field>

                {/* Password Strength Meter */}
                <PasswordStrength password={passwordValue} />
              </Field>

              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Already have an account? <a href="/login" className="underline">Sign in</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
