"use client";

import React from "react";
import IconButton from "@/components/ui/IconButton";
import Sparkline from "./charts/Sparkline";
import type { KpiData } from "@/lib/types";

interface KpiCardProps extends KpiData { }

export default function KpiCard({
    title,
    value,
    deltaPercent,
    deltaDirection,
    sparklineData,
}: KpiCardProps) {
    const isPositive = deltaDirection === "up";

    return (
        <div className="bg-white rounded-xl border border-[#EAECF0] p-5 relative">
            {/* Menu Button */}
            <IconButton
                aria-label="More options"
                className="absolute top-4 right-4"
                size="sm"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M8 8.66667C8.36819 8.66667 8.66667 8.36819 8.66667 8C8.66667 7.63181 8.36819 7.33333 8 7.33333C7.63181 7.33333 7.33333 7.63181 7.33333 8C7.33333 8.36819 7.63181 8.66667 8 8.66667Z"
                        stroke="currentColor"
                        strokeWidth="1.33"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M8 4C8.36819 4 8.66667 3.70152 8.66667 3.33333C8.66667 2.96514 8.36819 2.66667 8 2.66667C7.63181 2.66667 7.33333 2.96514 7.33333 3.33333C7.33333 3.70152 7.63181 4 8 4Z"
                        stroke="currentColor"
                        strokeWidth="1.33"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M8 13.3333C8.36819 13.3333 8.66667 13.0349 8.66667 12.6667C8.66667 12.2985 8.36819 12 8 12C7.63181 12 7.33333 12.2985 7.33333 12.6667C7.33333 13.0349 7.63181 13.3333 8 13.3333Z"
                        stroke="currentColor"
                        strokeWidth="1.33"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </IconButton>

            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-[#667085] mb-1">{title}</p>
                    <p className="text-2xl lg:text-3xl font-semibold text-[#101828] mb-2">
                        {value}
                    </p>
                    <div className="flex items-center gap-1.5">
                        <span
                            className={`inline-flex items-center gap-0.5 text-sm font-medium ${isPositive ? "text-[#12B76A]" : "text-[#F04438]"
                                }`}
                        >
                            {isPositive ? (
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6 9.5V2.5M6 2.5L2.5 6M6 2.5L9.5 6"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6 2.5V9.5M6 9.5L9.5 6M6 9.5L2.5 6"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            )}
                            {deltaPercent}%
                        </span>
                        <span className="text-sm text-[#667085]">vs last month</span>
                    </div>
                </div>

                {/* Sparkline */}
                <div className="w-24 h-12 flex-shrink-0 mt-8">
                    <Sparkline data={sparklineData} color={isPositive ? "#12B76A" : "#F04438"} />
                </div>
            </div>
        </div>
    );
}
