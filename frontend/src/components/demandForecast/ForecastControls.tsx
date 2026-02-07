// components/demandForecast/ForecastControls.tsx
"use client";

import React from "react";
import type { Product } from "@/lib/types";

interface ForecastControlsProps {
    products: Product[];
    selectedProductId: string;
    onProductChange: (id: string) => void;
    date: string;
    onDateChange: (date: string) => void;
    temp: number;
    onTempChange: (t: number) => void;
    rain: number;
    onRainChange: (r: number) => void;
    holiday: boolean;
    onHolidayChange: (h: boolean) => void;
    onPredict: () => void;
    loading: boolean;
}

export default function ForecastControls({
    products,
    selectedProductId,
    onProductChange,
    date,
    onDateChange,
    temp,
    onTempChange,
    rain,
    onRainChange,
    holiday,
    onHolidayChange,
    onPredict,
    loading,
}: ForecastControlsProps) {
    return (
        <div className="bg-white rounded-xl border border-[#EAECF0] p-6 shadow-sm h-full">
            <h3 className="text-base font-semibold text-[#101828] mb-5">
                Forecast Controls
            </h3>

            {/* Product Select */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-[#344054] mb-1.5">
                    Product
                </label>
                <select
                    value={selectedProductId}
                    onChange={(e) => onProductChange(e.target.value)}
                    className="w-full rounded-lg border border-[#D0D5DD] px-3 py-2.5 text-sm text-[#101828] bg-white focus:outline-none focus:ring-2 focus:ring-[#6941C6] focus:border-[#6941C6]"
                >
                    <option value="">Select a product…</option>
                    {products.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name} — {p.category}
                        </option>
                    ))}
                </select>
            </div>

            {/* Date Picker */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-[#344054] mb-1.5">
                    Forecast Date
                </label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => onDateChange(e.target.value)}
                    className="w-full rounded-lg border border-[#D0D5DD] px-3 py-2.5 text-sm text-[#101828] bg-white focus:outline-none focus:ring-2 focus:ring-[#6941C6] focus:border-[#6941C6]"
                />
            </div>

            {/* Temperature */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-[#344054] mb-1.5">
                    Temperature (°C)
                </label>
                <input
                    type="number"
                    step="0.1"
                    value={temp}
                    onChange={(e) => onTempChange(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-[#D0D5DD] px-3 py-2.5 text-sm text-[#101828] bg-white focus:outline-none focus:ring-2 focus:ring-[#6941C6] focus:border-[#6941C6]"
                />
            </div>

            {/* Rainfall */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-[#344054] mb-1.5">
                    Rainfall (mm)
                </label>
                <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={rain}
                    onChange={(e) => onRainChange(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-[#D0D5DD] px-3 py-2.5 text-sm text-[#101828] bg-white focus:outline-none focus:ring-2 focus:ring-[#6941C6] focus:border-[#6941C6]"
                />
            </div>

            {/* Holiday Toggle */}
            <div className="mb-6 flex items-center justify-between">
                <label className="text-sm font-medium text-[#344054]">
                    Holiday
                </label>
                <button
                    type="button"
                    role="switch"
                    aria-checked={holiday}
                    onClick={() => onHolidayChange(!holiday)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${holiday ? "bg-[#6941C6]" : "bg-[#D0D5DD]"
                        }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${holiday ? "translate-x-6" : "translate-x-1"
                            }`}
                    />
                </button>
            </div>

            {/* CTA */}
            <button
                onClick={onPredict}
                disabled={loading || !selectedProductId}
                className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-[#6941C6] hover:bg-[#53389E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
                {loading && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? "Predicting…" : "Predict Demand"}
            </button>
        </div>
    );
}
