// components/demandForecast/PortfolioTable.tsx
"use client";

import React from "react";
import type { PortfolioRow } from "@/lib/types";
import { exportToCsv } from "@/lib/csv";

interface PortfolioTableProps {
    rows: PortfolioRow[];
    loading: boolean;
}

const statusBadge = {
    stockout: { label: "Stockout Risk", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
    ok: { label: "OK", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
    overstock: { label: "Overstock", bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
} as const;

export default function PortfolioTable({ rows, loading }: PortfolioTableProps) {
    const sorted = [...rows].sort((a, b) => b.gap - a.gap);

    const handleExport = () => {
        const data = sorted.map((r) => ({
            Product: r.product.name,
            Category: r.product.category,
            "Predicted Demand": Math.round(r.predictedDemand),
            "Current Stock": r.currentStock,
            Gap: Math.round(r.gap),
            Status: r.error || statusBadge[r.status]?.label || r.status,
        }));
        exportToCsv(
            `portfolio-forecast-${new Date().toISOString().slice(0, 10)}.csv`,
            data as unknown as Record<string, unknown>[],
            ["Product", "Category", "Predicted Demand", "Current Stock", "Gap", "Status"]
        );
    };

    return (
        <div className="bg-white rounded-xl border border-[#EAECF0] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAECF0]">
                <h3 className="text-base font-semibold text-[#101828]">
                    Portfolio Forecast
                </h3>
                <button
                    onClick={handleExport}
                    disabled={rows.length === 0}
                    className="text-sm font-medium text-[#6941C6] hover:text-[#53389E] disabled:opacity-40 transition-colors"
                >
                    Export CSV
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="w-8 h-8 border-4 border-[#6941C6] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : sorted.length === 0 ? (
                <div className="text-sm text-[#667085] text-center py-16">
                    No forecast data yet. Run a portfolio prediction.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#EAECF0] bg-[#F9FAFB]">
                                <th className="text-left px-6 py-3 text-xs font-medium text-[#667085] uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-medium text-[#667085] uppercase tracking-wider">
                                    Predicted
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-medium text-[#667085] uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-medium text-[#667085] uppercase tracking-wider">
                                    Gap
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-medium text-[#667085] uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EAECF0]">
                            {sorted.map((r) => {
                                const badge = r.error
                                    ? { label: "Unavailable", bg: "bg-gray-50", text: "text-gray-500", dot: "bg-gray-400" }
                                    : statusBadge[r.status];
                                return (
                                    <tr key={r.skuId} className="hover:bg-[#F9FAFB] transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-[#101828]">{r.product.name}</p>
                                            <p className="text-xs text-[#667085]">{r.product.category}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-[#101828]">
                                            {r.error ? "—" : Math.round(r.predictedDemand)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-[#667085]">
                                            {r.currentStock}
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium">
                                            {r.error ? (
                                                "—"
                                            ) : (
                                                <span className={r.gap > 0 ? "text-red-600" : r.gap < 0 ? "text-green-600" : "text-[#101828]"}>
                                                    {r.gap > 0 ? "+" : ""}{Math.round(r.gap)}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                                {badge.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
