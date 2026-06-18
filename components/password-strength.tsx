"use client";

import { calculatePasswordStrength } from "@/lib/password";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
}

/**
 * A visual segmented bar + label that shows how strong the entered password is.
 * Renders 4 small bars that fill up progressively with color.
 */
export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { score, label, color, barColor } = calculatePasswordStrength(password);

  // Don't render anything until the user starts typing
  if (!password) return null;

  return (
    <div className="space-y-1.5 mt-1.5">
      {/* Segmented bar */}
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-300",
              i < score ? barColor : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* Label */}
      <p className={cn("text-xs font-medium transition-colors", color)}>
        {label}
      </p>
    </div>
  );
}
