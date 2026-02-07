"use client";

import React, { useId, useState } from "react";

interface TextInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
    label: string;
    name: string;
    type?: "text" | "email" | "password";
    placeholder?: string;
    error?: string;
    rightSlot?: React.ReactNode;
}

export default function TextInput({
    label,
    name,
    type = "text",
    placeholder,
    error,
    rightSlot,
    required,
    className = "",
    ...props
}: TextInputProps) {
    const id = useId();
    const [showPassword, setShowPassword] = useState(false);

    const inputType = type === "password" && showPassword ? "text" : type;

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            <label
                htmlFor={id}
                className="text-sm font-medium text-[var(--text-title)]"
            >
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <div className="relative">
                <input
                    id={id}
                    name={name}
                    type={inputType}
                    placeholder={placeholder}
                    required={required}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? `${id}-error` : undefined}
                    className={`
            w-full px-4 py-3
            border rounded-[var(--radius-lg)]
            text-[var(--text-title)] text-sm
            placeholder:text-[var(--text-muted)]
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-[var(--brand-purple)] focus:border-transparent
            disabled:bg-gray-50 disabled:cursor-not-allowed
            ${error
                            ? "border-[var(--error)] focus:ring-[var(--error)]"
                            : "border-[var(--input-border)]"
                        }
            ${type === "password" || rightSlot ? "pr-12" : ""}
          `}
                    {...props}
                />
                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-body)] hover:text-[var(--text-title)] transition-colors p-1"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        )}
                    </button>
                )}
                {rightSlot && type !== "password" && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {rightSlot}
                    </div>
                )}
            </div>
            {error && (
                <p id={`${id}-error`} className="text-sm text-[var(--error)]" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
