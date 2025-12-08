"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "dark" | "luxury";
  children: React.ReactNode;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "glass",
      dark: "glass-dark",
      luxury: "glass-luxury",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg p-6 transition-all duration-300",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
