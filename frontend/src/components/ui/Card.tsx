"use client";

import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    header?: React.ReactNode;
    headerAction?: React.ReactNode;
}

export default function Card({
    children,
    className = "",
    header,
    headerAction,
}: CardProps) {
    return (
        <div
            className={`bg-white rounded-xl border border-[#EAECF0] shadow-sm ${className}`}
        >
            {header && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAECF0]">
                    <h3 className="text-base font-semibold text-[#101828]">{header}</h3>
                    {headerAction}
                </div>
            )}
            {children}
        </div>
    );
}
