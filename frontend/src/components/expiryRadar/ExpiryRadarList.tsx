// components/expiryRadar/ExpiryRadarList.tsx
"use client";

import React from "react";
import type { ExpiryProduct } from "./expiryRadarUtils";
import { statusConfig } from "./expiryRadarUtils";

interface ExpiryRadarListProps {
    items: ExpiryProduct[];
}

export default function ExpiryRadarList({ items }: ExpiryRadarListProps) {
    if (items.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400 text-sm">
                No products match the current filters.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-[#EAECF0]">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                    <tr>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3 text-right">Qty</th>
                        <th className="px-4 py-3 text-right">Price</th>
                        <th className="px-4 py-3">Expiry</th>
                        <th className="px-4 py-3 text-right">Days Left</th>
                        <th className="px-4 py-3">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#EAECF0]">
                    {items.map((p) => {
                        const cfg = statusConfig[p.status];
                        return (
                            <tr
                                key={p.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-4 py-3 font-medium text-gray-900">
                                    {p.name}
                                </td>
                                <td className="px-4 py-3 text-gray-500">{p.category}</td>
                                <td className="px-4 py-3 text-right text-gray-700">
                                    {p.quantity}
                                </td>
                                <td className="px-4 py-3 text-right text-gray-700">
                                    ${p.price.toFixed(2)}
                                </td>
                                <td className="px-4 py-3 text-gray-500">
                                    {new Date(p.expiry).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </td>
                                <td className="px-4 py-3 text-right font-medium text-gray-700">
                                    {p.daysLeft <= 0
                                        ? `${Math.abs(p.daysLeft)}d overdue`
                                        : `${p.daysLeft}d`}
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
                                    >
                                        <span
                                            className="w-1.5 h-1.5 rounded-full"
                                            style={{ backgroundColor: cfg.dot }}
                                        />
                                        {cfg.label}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
