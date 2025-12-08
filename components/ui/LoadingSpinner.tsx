"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export const LoadingSpinner = ({
  size = "md",
  className,
  text,
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className
      )}
    >
      <Loader2
        className={cn(
          "animate-spin text-[var(--color-gold)]",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-sm text-[var(--color-charcoal-lighter)] animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

interface LoadingSkeletonProps {
  className?: string;
}

export const LoadingSkeleton = ({ className }: LoadingSkeletonProps) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded",
        className
      )}
      style={{
        animation: "shimmer 2s infinite",
      }}
    />
  );
};

interface ProductCardSkeletonProps {
  count?: number;
}

export const ProductCardSkeleton = ({
  count = 1,
}: ProductCardSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="glass-luxury rounded-lg overflow-hidden">
          <LoadingSkeleton className="w-full aspect-[3/4]" />
          <div className="p-6 space-y-3">
            <LoadingSkeleton className="h-4 w-24" />
            <LoadingSkeleton className="h-6 w-full" />
            <LoadingSkeleton className="h-4 w-32" />
          </div>
        </div>
      ))}
    </>
  );
};
