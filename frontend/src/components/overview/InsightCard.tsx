// components/overview/InsightCard.tsx
"use client";

import React from "react";
import Card from "@/components/ui/Card";

interface InsightCardProps {
    title: string;
    insight?: string;
    children: React.ReactNode;
    className?: string;
    action?: React.ReactNode;
}

export default function InsightCard({
    title,
    insight,
    children,
    className = "",
    action,
}: InsightCardProps) {
    return (
        <Card className={`p-6 ${className}`}>
            <div className="flex items-start justify-between gap-4 mb-1">
                <h3 className="text-base font-semibold text-[#101828]">{title}</h3>
                {action}
            </div>
            {insight && (
                <p className="text-sm text-[#667085] mb-4">{insight}</p>
            )}
            {children}
        </Card>
    );
}
