"use client";

import React, { useId } from "react";

interface CheckboxProps {
    label?: React.ReactNode;
    name: string;
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

export default function Checkbox({
    label,
    name,
    checked,
    defaultChecked,
    onChange,
    error,
}: CheckboxProps) {
    const id = useId();

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <div className="relative flex items-center">
                    <input
                        type="checkbox"
                        id={id}
                        name={name}
                        checked={checked}
                        defaultChecked={defaultChecked}
                        onChange={onChange}
                        aria-invalid={error ? "true" : "false"}
                        aria-describedby={error ? `${id}-error` : undefined}
                        className="
              peer
              h-5 w-5
              rounded-[4px]
              border border-[var(--input-border)]
              text-[var(--brand-purple)]
              cursor-pointer
              transition-colors duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-purple)] focus-visible:ring-offset-2
              checked:bg-[var(--brand-purple)] checked:border-[var(--brand-purple)]
              appearance-none
            "
                    />
                    <svg
                        className="absolute left-0.5 top-0.5 w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                <label
                    htmlFor={id}
                    className="text-sm text-[var(--text-body)] cursor-pointer select-none"
                >
                    {label}
                </label>
            </div>
            {error && (
                <p id={`${id}-error`} className="text-sm text-[var(--error)]" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
