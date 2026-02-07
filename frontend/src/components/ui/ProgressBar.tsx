"use client";

import React from "react";

interface ProgressBarProps {
    value: number;
    max?: number;
    className?: string;
    showLabel?: boolean;
}

export default function ProgressBar({
    value,
    max = 100,
    className = "",
    showLabel = true,
}: ProgressBarProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="flex-1 h-2 bg-[#F4EBFF] rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#7F56D9] rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {showLabel && (
                <span className="text-sm font-medium text-[#344054] min-w-[40px] text-right">
                    {value}%
                </span>
            )}
        </div>
    );
}
