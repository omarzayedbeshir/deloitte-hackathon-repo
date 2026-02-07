// components/demandForecast/ForecastResult.tsx
"use client";

import React from "react";
import type { Product } from "@/lib/types";

interface ForecastResultProps {
    prediction: number | null;
    product: Product | null;
    loading: boolean;
    error: string | null;
    modelMissing: boolean;
}

export default function ForecastResult({
    prediction,
    product,
    loading,
    error,
    modelMissing,
}: ForecastResultProps) {
    const stock = product?.quantity ?? 0;
    const gap = prediction !== null ? prediction - stock : 0;
    const coverageDays =
        prediction !== null && prediction > 0
            ? Math.round(stock / (prediction / 7))
            : null;

    return (
        <div className="bg-white rounded-xl border border-[#EAECF0] p-6 shadow-sm h-full flex flex-col">
            <h3 className="text-base font-semibold text-[#101828] mb-5">
                Results &amp; Insights
            </h3>

            {/* Model missing banner */}
            {modelMissing && (
                <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 mb-4">
                    <p className="text-sm font-medium text-yellow-800">
                        No model found for this SKU. Try another product.
                    </p>
                </div>
            )}

            {/* Error banner */}
            {error && !modelMissing && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-4">
                    <p className="text-sm font-medium text-red-700">{error}</p>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-[#6941C6] border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Empty state */}
            {!loading && prediction === null && !error && (
                <div className="flex-1 flex items-center justify-center text-[#667085] text-sm">
                    Select a product and click &quot;Predict Demand&quot; to see results.
                </div>
            )}

            {/* Prediction result */}
            {!loading && prediction !== null && product && (
                <div className="flex-1 space-y-5">
                    {/* Big number */}
                    <div className="text-center pb-4 border-b border-[#EAECF0]">
                        <p className="text-sm text-[#667085] mb-1">Predicted Demand</p>
                        <p className="text-4xl font-bold text-[#6941C6]">
                            {Math.round(prediction)}
                            <span className="text-base font-normal text-[#667085] ml-1">units</span>
                        </p>
                    </div>

                    {/* Context lines */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-[#667085]">Current Stock</span>
                            <span className="font-medium text-[#101828]">{stock} units</span>
                        </div>

                        {coverageDays !== null && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#667085]">Estimated Stock Coverage</span>
                                <span className="font-medium text-[#101828]">~{coverageDays} days</span>
                            </div>
                        )}

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-[#667085]">Risk Assessment</span>
                            {gap > 0 ? (
                                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600">
                                    <span className="w-2 h-2 rounded-full bg-red-500" />
                                    Stockout likely
                                </span>
                            ) : stock > prediction * 2 ? (
                                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-yellow-600">
                                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                                    Overstock risk
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                    Adequate
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Suggested actions */}
                    <div className="pt-4 border-t border-[#EAECF0]">
                        <p className="text-sm font-semibold text-[#101828] mb-2">
                            Suggested Actions
                        </p>
                        <ul className="space-y-2">
                            {gap > 0 && (
                                <li className="flex items-start gap-2 text-sm text-[#344054]">
                                    <span className="mt-0.5 text-[#6941C6]">→</span>
                                    Reorder recommended: <strong>{Math.round(gap)} units</strong>
                                </li>
                            )}
                            {stock > prediction * 2 && (
                                <li className="flex items-start gap-2 text-sm text-[#344054]">
                                    <span className="mt-0.5 text-[#6941C6]">→</span>
                                    Consider discount or promotion to move excess stock
                                </li>
                            )}
                            {gap <= 0 && stock <= prediction * 2 && (
                                <li className="flex items-start gap-2 text-sm text-[#344054]">
                                    <span className="mt-0.5 text-green-500">✓</span>
                                    Stock levels are adequate — no action needed
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
