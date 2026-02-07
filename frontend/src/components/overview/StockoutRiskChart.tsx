// components/overview/StockoutRiskChart.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import InsightCard from "./InsightCard";
import type { Product, PortfolioRow, ForecastParams } from "@/lib/types";
import { getSkuId } from "@/lib/skuMap";
import { predictBatch } from "@/lib/api/forecast";
import {
    computeStockoutRisks,
    stockoutInsightText,
    type StockoutRiskItem,
} from "@/lib/analytics/forecastMetrics";

interface Props {
    products: Product[];
    loading: boolean;
}

function formatDate(d: Date): string {
    return d.toISOString().slice(0, 10);
}

export default function StockoutRiskChart({ products, loading }: Props) {
    const [risks, setRisks] = useState<StockoutRiskItem[]>([]);
    const [forecastLoading, setForecastLoading] = useState(false);
    const [forecastRan, setForecastRan] = useState(false);

    const topProducts = useMemo(
        () => [...products].sort((a, b) => b.quantity - a.quantity).slice(0, 8),
        [products]
    );

    useEffect(() => {
        if (topProducts.length === 0 || loading) return;

        let cancelled = false;
        (async () => {
            setForecastLoading(true);
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 7);
            const dateStr = formatDate(futureDate);

            const paramsList: ForecastParams[] = topProducts.map((p) => ({
                sku_id: getSkuId(p.id, p.name, p.skuId),
                date: dateStr,
                temp: 25,
                rain: 0,
                holiday: 0,
            }));

            const results = await predictBatch(paramsList, 3);

            if (cancelled) return;

            const rows: PortfolioRow[] = topProducts.map((p) => {
                const skuId = getSkuId(p.id, p.name, p.skuId);
                const res = results.find((r) => r.skuId === skuId);
                const predicted = res?.result?.prediction ?? 0;
                const gap = predicted - p.quantity;
                let status: "stockout" | "ok" | "overstock" = "ok";
                if (res?.error) status = "ok";
                else if (predicted > p.quantity) status = "stockout";
                else if (p.quantity > predicted * 2) status = "overstock";

                return {
                    product: p,
                    skuId,
                    predictedDemand: predicted,
                    currentStock: p.quantity,
                    gap,
                    status,
                    error: res?.error,
                };
            });

            setRisks(computeStockoutRisks(rows));
            setForecastRan(true);
            setForecastLoading(false);
        })();

        return () => { cancelled = true; };
    }, [topProducts, loading]);

    const insight = forecastRan
        ? stockoutInsightText(risks)
        : "Analyzing top products for stockout risk…";

    const chartData = risks.slice(0, 8).map((r) => ({
        name: r.product.name.length > 12 ? r.product.name.slice(0, 12) + "…" : r.product.name,
        risk: r.riskScore,
        reorder: r.reorderQty,
        status: r.status,
    }));

    const isLoading = loading || forecastLoading;

    return (
        <InsightCard title="Top Stockout Risks (7-Day Forecast)" insight={insight}>
            {isLoading ? (
                <div className="h-[280px] flex items-center justify-center">
                    <div className="w-6 h-6 border-4 border-[#6941C6] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : !forecastRan || chartData.length === 0 ? (
                <div className="h-[280px] flex items-center justify-center text-sm text-[#667085]">
                    No forecast data available. Ensure products have demand models.
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" barCategoryGap="20%">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EAECF0" />
                                <XAxis
                                    type="number"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#667085", fontSize: 11 }}
                                />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#667085", fontSize: 11 }}
                                    width={100}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #EAECF0",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                        fontSize: "12px",
                                    }}
                                    formatter={(val) => [`${Math.round(Number(val))} units`, "Risk Score"]}
                                />
                                <Bar dataKey="risk" radius={[0, 4, 4, 0]}>
                                    {chartData.map((entry, idx) => (
                                        <Cell
                                            key={idx}
                                            fill={
                                                entry.risk > 0
                                                    ? "#EF4444"
                                                    : entry.status === "overstock"
                                                        ? "#EAB308"
                                                        : "#22C55E"
                                            }
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Reorder table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-[#EAECF0]">
                                    <th className="text-left py-2 px-2 text-[#667085] font-medium">Product</th>
                                    <th className="text-right py-2 px-2 text-[#667085] font-medium">Reorder</th>
                                    <th className="text-center py-2 px-2 text-[#667085] font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EAECF0]">
                                {risks.slice(0, 5).map((r) => (
                                    <tr key={r.skuId}>
                                        <td className="py-1.5 px-2 text-[#101828]">{r.product.name}</td>
                                        <td className="py-1.5 px-2 text-right font-medium text-[#101828]">
                                            {r.reorderQty > 0 ? `+${r.reorderQty}` : "—"}
                                        </td>
                                        <td className="py-1.5 px-2 text-center">
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.status === "stockout"
                                                        ? "bg-red-50 text-red-700"
                                                        : r.status === "overstock"
                                                            ? "bg-yellow-50 text-yellow-700"
                                                            : "bg-green-50 text-green-700"
                                                    }`}
                                            >
                                                {r.status === "stockout" ? "Risk" : r.status === "overstock" ? "Overstock" : "OK"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </InsightCard>
    );
}
