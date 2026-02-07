// components/overview/SalesInventoryChart.tsx
"use client";

import React, { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import Card from "@/components/ui/Card";
import IconButton from "@/components/ui/IconButton";
import type { Transaction } from "@/lib/types";
import {
    buildMonthlySeries,
    extractYears,
    rangeFromKey,
    type RangeKey,
} from "@/lib/analytics/overviewMetrics";

interface Props {
    transactions: Transaction[];
    loading: boolean;
    rangeKey: RangeKey;
}

function ChartSkeleton() {
    return (
        <div className="h-[300px] w-full animate-pulse flex items-end justify-center gap-3 px-8 pb-6">
            {Array.from({ length: 12 }).map((_, i) => (
                <div
                    key={i}
                    className="bg-[#F2F4F7] rounded-t"
                    style={{ width: 24, height: 40 + Math.random() * 160 }}
                />
            ))}
        </div>
    );
}

export default function SalesInventoryChart({
    transactions,
    loading,
    rangeKey,
}: Props) {
    const range = useMemo(() => rangeFromKey(rangeKey), [rangeKey]);
    const bars = useMemo(
        () => buildMonthlySeries(transactions, range),
        [transactions, range]
    );
    const years = useMemo(() => extractYears(bars), [bars]);
    const hasData = bars.some((b) => b.grossSalesRevenue > 0 || b.inventoryMoved > 0);

    return (
        <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h3 className="text-base font-semibold text-[#101828]">
                    Monthly Sales Vs Inventory Analysis
                </h3>
                <IconButton aria-label="Collapse chart">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12.5L10 7.5L15 12.5" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </IconButton>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-6 mb-4">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4E5BA6]" />
                    <span className="text-sm text-[#667085]">Gross Sales Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#F79009]" />
                    <span className="text-sm text-[#667085]">Inventory Moved</span>
                </div>
            </div>

            {/* Chart or states */}
            {loading ? (
                <ChartSkeleton />
            ) : !hasData ? (
                <div className="h-[300px] w-full flex flex-col items-center justify-center text-[#667085]">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-3 opacity-40">
                        <rect x="4" y="20" width="8" height="20" rx="2" fill="#D0D5DD" />
                        <rect x="16" y="12" width="8" height="28" rx="2" fill="#D0D5DD" />
                        <rect x="28" y="16" width="8" height="24" rx="2" fill="#D0D5DD" />
                        <rect x="40" y="8" width="4" height="32" rx="2" fill="#D0D5DD" />
                    </svg>
                    <p className="text-sm font-medium">No transaction data available for this period.</p>
                    <p className="text-xs mt-1">Create sales transactions to see chart data.</p>
                </div>
            ) : (
                <>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={bars} barCategoryGap="20%">
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAECF0" />
                                <XAxis
                                    dataKey="label"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#667085", fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#667085", fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #EAECF0",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                    }}
                                    formatter={(val, name) => {
                                        const label = name === "grossSalesRevenue" ? "Revenue" : "Units Moved";
                                        return [`${Number(val).toLocaleString()}`, label];
                                    }}
                                    labelFormatter={(label, payload) => {
                                        const item = payload?.[0]?.payload;
                                        return item ? `${label} ${item.year}` : String(label);
                                    }}
                                />
                                <Bar
                                    dataKey="grossSalesRevenue"
                                    stackId="a"
                                    fill="#4E5BA6"
                                    radius={[0, 0, 0, 0]}
                                    name="grossSalesRevenue"
                                />
                                <Bar
                                    dataKey="inventoryMoved"
                                    stackId="a"
                                    fill="#F79009"
                                    radius={[4, 4, 0, 0]}
                                    name="inventoryMoved"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Year Labels */}
                    {years.length > 0 && (
                        <div className="flex justify-center gap-8 mt-4">
                            {years.map((y) => (
                                <span key={y} className="text-sm font-medium text-[#F79009]">{y}</span>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Navigation Arrows */}
            <div className="flex justify-between mt-4">
                <IconButton aria-label="Previous" className="text-[#12B76A]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M14 8L10 12L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </IconButton>
                <IconButton aria-label="Next" className="text-[#F79009]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M10 8L14 12L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </IconButton>
            </div>
        </Card>
    );
}
