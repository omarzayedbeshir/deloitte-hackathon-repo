// components/ui/PageLoader.tsx
import React from "react";
import Spinner from "./Spinner";

interface PageLoaderProps {
    text?: string;
    showBackdrop?: boolean;
    variant?: "primary" | "muted" | "white";
}

export default function PageLoader({
    text,
    showBackdrop = false,
    variant = "primary",
}: PageLoaderProps) {
    return (
        <div
            className={`
        fixed inset-0 z-50 flex flex-col items-center justify-center gap-3
        ${showBackdrop ? "bg-black/50 backdrop-blur-sm" : "bg-white/80"}
        ${showBackdrop ? "overflow-hidden" : ""}
      `}
            role="alert"
            aria-busy="true"
        >
            <Spinner size="lg" variant={showBackdrop ? "white" : variant} label={text || "Loading page"} />
            {text && (
                <p
                    className={`text-sm font-medium ${showBackdrop ? "text-white" : "text-[var(--text-body)]"
                        }`}
                >
                    {text}
                </p>
            )}
        </div>
    );
}
