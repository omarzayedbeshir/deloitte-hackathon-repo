// components/overview/InventoryHealthChart.tsx
"use client";

import React, { useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import InsightCard from "./InsightCard";
import type { Transaction, Product } from "@/lib/types";
import { dailySalesFromTransactions } from "@/lib/analytics/inventoryMetrics";

interface Props {
    products: Product[];
    transactions: Transaction[];
    loading: boolean;
}

export default function InventoryHealthChart({ products, transactions, loading }: Props) {
    const hasTransactions = transactions.length > 0;

    const data = useMemo(() => {
        if (hasTransactions) {
            return dailySalesFromTransactions(transactions, 30);
        }
        // Snapshot fallback: show total inventory value as single bar
        const totalValue = products.reduce((s, p) => s + p.quantity * p.price, 0);
        const totalUnits = products.reduce((s, p) => s + p.quantity, 0);
        const today = new Date().toISOString().slice(0, 10);
        const d = new Date();
        return [
            { date: today, label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), value: totalUnits },
        ];
    }, [products, transactions, hasTransactions]);

    const label = hasTransactions ? "Units Sold (Last 30 Days)" : "Inventory Snapshot";
    const insight = hasTransactions
        ? (() => {
            const total = data.reduce((s, d) => s + d.value, 0);
            const avg = data.length > 0 ? Math.round(total / data.length) : 0;
            return `${total.toLocaleString()} total units sold · ~${avg} avg/day over the last 30 days.`;
        })()
        : "Showing current inventory snapshot. Transaction history will enable trend analysis.";

    if (loading) {
        return (
            <InsightCard title={label} insight="Loading…">
                <div className="h-[280px] flex items-center justify-center">
                    <div className="w-6 h-6 border-4 border-[#6941C6] border-t-transparent rounded-full animate-spin" />
                </div>
            </InsightCard>
        );
    }

    return (
        <InsightCard title={label} insight={insight}>
            {!hasTransactions && (
                <span className="inline-block mb-2 px-2 py-0.5 bg-[#F2F4F7] text-[#667085] text-xs rounded-full">
                    Snapshot only
                </span>
            )}
            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6941C6" stopOpacity={0.15} />
                                <stop offset="100%" stopColor="#6941C6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAECF0" />
                        <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#667085", fontSize: 11 }}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#667085", fontSize: 11 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #EAECF0",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                fontSize: "12px",
                            }}
                            formatter={(val) => [`${Number(val).toLocaleString()} units`, hasTransactions ? "Sold" : "On hand"]}
                            labelFormatter={(l) => l}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#6941C6"
                            strokeWidth={2}
                            fill="url(#areaGrad)"
                            dot={false}
                            activeDot={{ r: 4, fill: "#6941C6" }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </InsightCard>
    );
}
