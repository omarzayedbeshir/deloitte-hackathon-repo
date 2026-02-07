"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";
import { dateRanges } from "@/lib/dashboardMock";
import { useAuth } from "@/lib/AuthContext";

interface HeaderBarProps {
    onMenuClick: () => void;
}

export default function HeaderBar({ onMenuClick }: HeaderBarProps) {
    const { username } = useAuth();
    const [selectedRange, setSelectedRange] = useState("6m");

    const tabOptions = dateRanges.map((range) => ({
        label: range,
        value: range,
    }));

    return (
        <header className="bg-white lg:bg-transparent">
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-4 py-3 lg:hidden border-b border-[#EAECF0]">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Open menu"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M3 12H21M3 6H21M3 18H21"
                            stroke="#101828"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
                <span className="text-lg font-semibold text-[#101828]">Dashboard</span>
                <div className="w-10" />
            </div>

            {/* Desktop Header */}
            <div className="px-4 lg:px-0 py-4 lg:py-0">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <h1 className="text-2xl lg:text-3xl font-semibold text-[#101828]">
                        Welcome back, {username}
                    </h1>
                </div>

                {/* Tabs and Actions Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 lg:mt-6">
                    {/* Date Range Tabs */}
                    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                        <Tabs
                            options={tabOptions}
                            value={selectedRange}
                            onChange={setSelectedRange}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button
                            variant="outline"
                            size="sm"
                            leftIcon={
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M10 4.16667V15.8333M4.16667 10H15.8333"
                                        stroke="currentColor"
                                        strokeWidth="1.67"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            }
                        >
                            Add Metrics
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            leftIcon={
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M17.5 8.33333H2.5M13.3333 1.66667V5M6.66667 1.66667V5M6.5 18.3333H13.5C14.9001 18.3333 15.6002 18.3333 16.135 18.0609C16.6054 17.8212 16.9878 17.4387 17.2275 16.9683C17.5 16.4335 17.5 15.7335 17.5 14.3333V7.33333C17.5 5.93321 17.5 5.23314 17.2275 4.69836C16.9878 4.22796 16.6054 3.8455 16.135 3.60582C15.6002 3.33333 14.9001 3.33333 13.5 3.33333H6.5C5.09987 3.33333 4.3998 3.33333 3.86502 3.60582C3.39462 3.8455 3.01217 4.22796 2.77248 4.69836C2.5 5.23314 2.5 5.93321 2.5 7.33333V14.3333C2.5 15.7335 2.5 16.4335 2.77248 16.9683C3.01217 17.4387 3.39462 17.8212 3.86502 18.0609C4.3998 18.3333 5.09987 18.3333 6.5 18.3333Z"
                                        stroke="currentColor"
                                        strokeWidth="1.67"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            }
                        >
                            Select dates
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            leftIcon={
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M5 10H15M2.5 5H17.5M7.5 15H12.5"
                                        stroke="currentColor"
                                        strokeWidth="1.67"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            }
                        >
                            Filters
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
