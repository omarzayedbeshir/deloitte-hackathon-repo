"use client";

import React from "react";

interface TabOption {
    label: string;
    value: string;
}

interface TabsProps {
    options: TabOption[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export default function Tabs({
    options,
    value,
    onChange,
    className = "",
}: TabsProps) {
    return (
        <div
            className={`inline-flex items-center bg-[#F9FAFB] rounded-lg p-1 ${className}`}
            role="tablist"
        >
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    role="tab"
                    aria-selected={value === option.value}
                    onClick={() => onChange(option.value)}
                    className={`
            px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6941C6] focus-visible:ring-offset-1
            ${value === option.value
                            ? "bg-white text-[#101828] shadow-sm"
                            : "text-[#667085] hover:text-[#101828]"
                        }
          `}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
