// components/ui/InlineLoader.tsx
import React from "react";
import Spinner from "./Spinner";

type InlineLoaderSize = "xs" | "sm" | "md" | "lg";

interface InlineLoaderProps {
    text?: string;
    size?: InlineLoaderSize;
    variant?: "primary" | "muted" | "white";
    className?: string;
}

export default function InlineLoader({
    text,
    size = "sm",
    variant = "primary",
    className = "",
}: InlineLoaderProps) {
    return (
        <div
            className={`inline-flex items-center gap-2 ${className}`}
            role="status"
            aria-live="polite"
        >
            <Spinner size={size} variant={variant} label={text || "Loading"} />
            {text && (
                <span className="text-sm text-[var(--text-body)]">{text}</span>
            )}
        </div>
    );
}
