// components/utils/WithSuspense.tsx
"use client";

import React, { Suspense, ReactNode } from "react";
import InlineLoader from "@/components/ui/InlineLoader";
import Spinner from "@/components/ui/Spinner";

interface WithSuspenseProps {
    children: ReactNode;
    fallback?: ReactNode;
    /** Use "inline" for small sections, "centered" for larger content areas */
    fallbackType?: "inline" | "centered" | "custom";
    loadingText?: string;
}

export default function WithSuspense({
    children,
    fallback,
    fallbackType = "inline",
    loadingText = "Loading…",
}: WithSuspenseProps) {
    const getFallback = () => {
        if (fallback) return fallback;

        switch (fallbackType) {
            case "centered":
                return (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-3">
                            <Spinner size="md" variant="primary" label={loadingText} />
                            <p className="text-sm text-[var(--text-body)]">{loadingText}</p>
                        </div>
                    </div>
                );
            case "inline":
            default:
                return <InlineLoader text={loadingText} size="sm" />;
        }
    };

    return <Suspense fallback={getFallback()}>{children}</Suspense>;
}

// Export a card-specific loading skeleton
export function CardLoader({ className = "" }: { className?: string }) {
    return (
        <div
            className={`bg-white rounded-xl border border-[#EAECF0] p-6 animate-pulse ${className}`}
            role="status"
            aria-label="Loading content"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-4 bg-gray-200 rounded" />
            </div>
            <div className="space-y-3">
                <div className="h-8 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-40 bg-gray-200 rounded" />
            </div>
            <span className="sr-only">Loading content</span>
        </div>
    );
}

// Export a chart-specific loading skeleton
export function ChartLoader({
    height = "300px",
    className = "",
}: {
    height?: string;
    className?: string;
}) {
    return (
        <div
            className={`bg-white rounded-xl border border-[#EAECF0] p-6 ${className}`}
            role="status"
            aria-label="Loading chart"
        >
            <div className="animate-pulse">
                <div className="flex items-center justify-between mb-6">
                    <div className="h-5 w-48 bg-gray-200 rounded" />
                    <div className="h-5 w-5 bg-gray-200 rounded" />
                </div>
                <div
                    className="bg-gray-100 rounded-lg flex items-center justify-center"
                    style={{ height }}
                >
                    <Spinner size="md" variant="muted" label="Loading chart" />
                </div>
            </div>
            <span className="sr-only">Loading chart</span>
        </div>
    );
}
