"use client";

import React from "react";

type ButtonVariant = "primary" | "outline" | "link" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-[#6941C6] text-white hover:bg-[#5a37a8] active:bg-[#4a2e8c]",
    outline:
        "bg-white border border-[#D0D5DD] text-[#344054] hover:bg-gray-50 active:bg-gray-100",
    link: "bg-transparent text-[#6941C6] hover:text-[#5a37a8] underline-offset-2 hover:underline p-0",
    ghost: "bg-transparent text-[#667085] hover:bg-gray-100 hover:text-[#101828]",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "py-2 px-3.5 text-sm",
    md: "py-2.5 px-4 text-sm",
    lg: "py-3 px-4 text-[15px]",
};

export default function Button({
    variant = "primary",
    size = "md",
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    className = "",
    disabled,
    type = "button",
    ...props
}: ButtonProps) {
    const baseStyles =
        "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6941C6] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg";

    const finalSizeStyles = variant === "link" ? "text-sm" : sizeStyles[size];

    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            className={`${baseStyles} ${finalSizeStyles} ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {isLoading ? (
                <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            ) : (
                <>
                    {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                </>
            )}
        </button>
    );
}
