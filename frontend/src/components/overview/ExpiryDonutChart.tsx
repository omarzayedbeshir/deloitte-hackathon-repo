// components/overview/ExpiryDonutChart.tsx
"use client";

import React, { useMemo } from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { useRouter } from "next/navigation";
import InsightCard from "./InsightCard";
import type { Product } from "@/lib/types";
import {
    computeExpiryCounts,
    expirySlices,
    expiryInsightText,
} from "@/lib/analytics/expiryMetrics";

interface Props {
    products: Product[];
    loading: boolean;
}

export default function ExpiryDonutChart({ products, loading }: Props) {
    const router = useRouter();

    const counts = useMemo(() => computeExpiryCounts(products), [products]);
    const slices = useMemo(() => expirySlices(counts), [counts]);
    const insight = useMemo(() => expiryInsightText(counts), [counts]);
    const total = counts.expired + counts.within7d + counts.within30d + counts.safe;

    const handleClick = (_: unknown, idx: number) => {
        const segment = slices[idx];
        if (!segment) return;
        const filterMap: Record<string, string> = {
            Expired: "expired",
            "≤ 7 days": "critical",
            "≤ 30 days": "warning",
            Safe: "safe",
        };
        const filter = filterMap[segment.name] ?? "";
        router.push(`/expiry-radar?filter=${filter}`);
    };

    if (loading) {
        return (
            <InsightCard title="Expiry Radar Summary" insight="Loading…">
                <div className="h-[200px] flex items-center justify-center">
                    <div className="w-6 h-6 border-4 border-[#6941C6] border-t-transparent rounded-full animate-spin" />
                </div>
            </InsightCard>
        );
    }

    return (
        <InsightCard title="Expiry Radar Summary" insight={insight}>
            {slices.length === 0 ? (
                <div className="h-[200px] flex items-center justify-center text-sm text-[#667085]">
                    No products with expiry data.
                </div>
            ) : (
                <>
                    <div className="h-[200px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={slices}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                    onClick={handleClick}
                                    className="cursor-pointer"
                                >
                                    {slices.map((s, i) => (
                                        <Cell key={i} fill={s.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #EAECF0",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                        fontSize: "12px",
                                    }}
                                    formatter={(val) => [
                                        `${Number(val)} item${Number(val) !== 1 ? "s" : ""}`,
                                    ]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <p className="text-lg font-semibold text-[#101828]">{total}</p>
                                <p className="text-xs text-[#667085]">Products</p>
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                        {slices.map((s) => (
                            <div key={s.name} className="flex items-center gap-2">
                                <span
                                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: s.color }}
                                />
                                <span className="text-xs text-[#667085]">{s.name}</span>
                                <span className="text-xs font-medium text-[#101828] ml-auto">{s.value}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </InsightCard>
    );
}
