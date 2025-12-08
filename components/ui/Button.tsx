"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "luxury" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const variants = {
      default:
        "bg-[var(--color-charcoal)] text-white hover:bg-[var(--color-charcoal-light)]",
      luxury:
        "relative px-8 py-4 bg-[var(--color-gold)] text-[var(--color-charcoal)] font-medium tracking-widest uppercase text-sm transition-all duration-500 ease-out border border-[var(--color-gold-dark)] overflow-hidden group",
      outline:
        "border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-charcoal)]",
      ghost: "hover:bg-[var(--color-cream-dark)] text-[var(--color-charcoal)]",
    };

    const sizes = {
      default: "h-10 px-6 py-2",
      sm: "h-9 px-4 text-sm",
      lg: "h-12 px-8 text-lg",
    };

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-none transition-all duration-300",
          "disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {variant === "luxury" ? (
          <>
            <span className="absolute inset-0 bg-[var(--color-charcoal)] transform -translate-x-full transition-transform duration-500 group-hover:translate-x-0" />
            <span className="relative z-10 group-hover:text-[var(--color-gold)]">
              {props.children}
            </span>
          </>
        ) : (
          props.children
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };
