"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, XCircle } from "lucide-react";
import { Button } from "./Button";

interface ErrorMessageProps {
  title?: string;
  message: string;
  className?: string;
  onRetry?: () => void;
  variant?: "default" | "inline";
}

export const ErrorMessage = ({
  title = "Đã có lỗi xảy ra",
  message,
  className,
  onRetry,
  variant = "default",
}: ErrorMessageProps) => {
  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800",
          className
        )}
      >
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm flex-1">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm font-medium hover:underline"
          >
            Thử lại
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-12 text-center",
        className
      )}
    >
      <div className="p-4 bg-red-50 rounded-full">
        <XCircle className="w-12 h-12 text-red-600" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-medium text-[var(--color-charcoal)]">
          {title}
        </h3>
        <p className="text-[var(--color-charcoal-lighter)] max-w-md">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="luxury" size="lg">
          Thử lại
        </Button>
      )}
    </div>
  );
};

interface EmptyStateProps {
  title?: string;
  message: string;
  className?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({
  title = "Không tìm thấy dữ liệu",
  message,
  className,
  action,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-12 text-center",
        className
      )}
    >
      <div className="space-y-2">
        <h3 className="text-xl font-medium text-[var(--color-charcoal)]">
          {title}
        </h3>
        <p className="text-[var(--color-charcoal-lighter)] max-w-md">
          {message}
        </p>
      </div>
      {action && (
        <Button onClick={action.onClick} variant="luxury" size="lg">
          {action.label}
        </Button>
      )}
    </div>
  );
};
