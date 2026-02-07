// components/overview/CategoryDistributionChart.tsx
"use client";

import React, { useMemo } from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import InsightCard from "./InsightCard";
import type { Product } from "@/lib/types";
import { categoryDistribution } from "@/lib/analytics/inventoryMetrics";

interface Props {
    products: Product[];
    loading: boolean;
}

export default function CategoryDistributionChart({ products, loading }: Props) {
    const slices = useMemo(() => categoryDistribution(products), [products]);
    const totalQty = useMemo(() => slices.reduce((s, sl) => s + sl.value, 0), [slices]);

    const topCat = slices[0];
    const insight =
        slices.length > 0
            ? `"${topCat.name}" holds ${Math.round((topCat.value / totalQty) * 100)}% of total stock (${totalQty.toLocaleString()} units).`
            : "No product data available.";

    if (loading) {
        return (
            <InsightCard title="Category Distribution" insight="Loading…">
                <div className="h-[200px] flex items-center justify-center">
                    <div className="w-6 h-6 border-4 border-[#6941C6] border-t-transparent rounded-full animate-spin" />
                </div>
            </InsightCard>
        );
    }

    return (
        <InsightCard title="Category Distribution" insight={insight}>
            {slices.length === 0 ? (
                <div className="h-[200px] flex items-center justify-center text-sm text-[#667085]">
                    No category data.
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
                                        `${Number(val).toLocaleString()} units`,
                                    ]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <p className="text-lg font-semibold text-[#101828]">
                                    {totalQty.toLocaleString()}
                                </p>
                                <p className="text-xs text-[#667085]">Total Units</p>
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-3 space-y-1.5">
                        {slices.slice(0, 5).map((s) => (
                            <div key={s.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: s.color }}
                                    />
                                    <span className="text-xs text-[#667085]">{s.name}</span>
                                </div>
                                <span className="text-xs font-medium text-[#101828]">
                                    {totalQty > 0 ? Math.round((s.value / totalQty) * 100) : 0}%
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </InsightCard>
    );
}
