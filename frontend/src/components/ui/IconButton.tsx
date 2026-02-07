"use client";

import React from "react";

interface IconButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    "aria-label": string;
    children: React.ReactNode;
    size?: "sm" | "md";
}

export default function IconButton({
    children,
    className = "",
    size = "md",
    ...props
}: IconButtonProps) {
    const sizeClasses = {
        sm: "p-1.5",
        md: "p-2",
    };

    return (
        <button
            type="button"
            className={`
        inline-flex items-center justify-center rounded-lg
        text-[#667085] hover:text-[#101828] hover:bg-gray-100
        transition-colors duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6941C6] focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${className}
      `}
            {...props}
        >
            {children}
        </button>
    );
}
