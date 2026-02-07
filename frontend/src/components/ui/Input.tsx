"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    leftIcon?: React.ReactNode;
    label?: string;
}

export default function Input({
    leftIcon,
    label,
    className = "",
    id,
    ...props
}: InputProps) {
    const inputId = id || props.name;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-[#344054] mb-1.5"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]">
                        {leftIcon}
                    </div>
                )}
                <input
                    id={inputId}
                    className={`
            w-full px-3.5 py-2.5 rounded-lg border border-[#D0D5DD]
            text-sm text-[#101828] placeholder:text-[#667085]
            bg-white
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-[#6941C6] focus:border-transparent
            disabled:bg-gray-50 disabled:cursor-not-allowed
            ${leftIcon ? "pl-10" : ""}
            ${className}
          `}
                    {...props}
                />
            </div>
        </div>
    );
}
