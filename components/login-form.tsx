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
import { Card, CardContent } from "@/components/ui/card";
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

      // NO MORE LOCAL STORAGE! The backend automatically sets the secure cookie.

      // CRITICAL: We must tell Zustand to fetch the newly logged-in user so the Navbar updates instantly!
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
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-3 text-center mb-2">
                <Image src="/images/logo/gurugram-it-networks-logo.webp" alt="Gurugram IT NETWORKS" width={240} height={60} className="h-10 md:h-12 w-auto" />
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Login to your Gurugram IT Networks account
                </p>
              </div>

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

              {/* PASSWORD */}
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline hover:text-primary"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <PasswordInput id="password" {...register("password")} />
                {errors.password && <FieldDescription className="text-red-500">{errors.password.message}</FieldDescription>}
              </Field>

              <Field>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>
          
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/placeholder.svg"
              alt="Image"
              fill
              className="absolute inset-0 object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary px-6">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
