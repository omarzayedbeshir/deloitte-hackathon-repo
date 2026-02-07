// components/ui/Spinner.tsx
import React from "react";

type SpinnerSize = "xs" | "sm" | "md" | "lg";
type SpinnerVariant = "primary" | "muted" | "white";

interface SpinnerProps {
    size?: SpinnerSize;
    variant?: SpinnerVariant;
    label?: string;
    className?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
    xs: "w-3 h-3 border-[1.5px]",
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-[3px]",
};

const variantClasses: Record<SpinnerVariant, string> = {
    primary: "border-[var(--brand-purple)] border-t-transparent",
    muted: "border-[var(--text-muted)] border-t-transparent",
    white: "border-white border-t-transparent",
};

export default function Spinner({
    size = "md",
    variant = "primary",
    label,
    className = "",
}: SpinnerProps) {
    const srText = label || "Loading…";

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label={srText}
            className={`inline-flex items-center justify-center ${className}`}
        >
            <div
                className={`
          rounded-full animate-spin
          ${sizeClasses[size]}
          ${variantClasses[variant]}
        `}
                aria-hidden="true"
            />
            <span className="sr-only">{srText}</span>
        </div>
    );
}
