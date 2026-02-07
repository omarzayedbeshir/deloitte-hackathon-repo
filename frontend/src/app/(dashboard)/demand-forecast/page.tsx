// app/(dashboard)/demand-forecast/page.tsx
"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Download } from "lucide-react";

import { useProducts } from "@/lib/ProductsContext";
import { getSkuId } from "@/lib/skuMap";
import { predictDemand, predictBatch, ForecastModelNotFoundError } from "@/lib/api/forecast";
import { exportToCsv } from "@/lib/csv";
import type { Product, PortfolioRow, ForecastParams } from "@/lib/types";

import ForecastControls from "@/components/demandForecast/ForecastControls";
import ForecastResult from "@/components/demandForecast/ForecastResult";
import PortfolioTable from "@/components/demandForecast/PortfolioTable";

function formatDate(d: Date): string {
    return d.toISOString().slice(0, 10);
}

export default function DemandForecastPage() {
    const { products, loading: productsLoading } = useProducts();

    // Mode
    const [mode, setMode] = useState<"single" | "portfolio">("single");

    // --- Single-product controls ---
    const [selectedProductId, setSelectedProductId] = useState("");
    const [date, setDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        return formatDate(d);
    });
    const [temp, setTemp] = useState(25);
    const [rain, setRain] = useState(0);
    const [holiday, setHoliday] = useState(false);

    // Single results
    const [prediction, setPrediction] = useState<number | null>(null);
    const [singleLoading, setSingleLoading] = useState(false);
    const [singleError, setSingleError] = useState<string | null>(null);
    const [modelMissing, setModelMissing] = useState(false);

    // Portfolio results
    const [portfolioRows, setPortfolioRows] = useState<PortfolioRow[]>([]);
    const [portfolioLoading, setPortfolioLoading] = useState(false);
    const [portfolioCount, setPortfolioCount] = useState(10);

    const selectedProduct = useMemo(
        () => products.find((p) => p.id === selectedProductId) ?? null,
        [products, selectedProductId]
    );

    // --- Single Predict ---
    const handlePredict = useCallback(async () => {
        if (!selectedProduct) return;
        setSingleLoading(true);
        setSingleError(null);
        setModelMissing(false);
        setPrediction(null);

        const skuId = getSkuId(selectedProduct.id, selectedProduct.name, selectedProduct.skuId);

        try {
            const res = await predictDemand({
                sku_id: skuId,
                date,
                temp,
                rain,
                holiday: holiday ? 1 : 0,
            });
            setPrediction(res.prediction);
        } catch (err) {
            if (err instanceof ForecastModelNotFoundError) {
                setModelMissing(true);
            } else {
                setSingleError(err instanceof Error ? err.message : "Prediction failed");
            }
        } finally {
            setSingleLoading(false);
        }
    }, [selectedProduct, date, temp, rain, holiday]);

    // --- Portfolio Predict ---
    const handlePortfolioPredict = useCallback(async () => {
        setPortfolioLoading(true);
        setPortfolioRows([]);

        // Pick top N products (by quantity, descending)
        const top = [...products]
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, portfolioCount);

        const paramsList: (ForecastParams & { product: Product })[] = top.map((p) => ({
            sku_id: getSkuId(p.id, p.name, p.skuId),
            date,
            temp,
            rain,
            holiday: holiday ? 1 : 0,
            product: p,
        }));

        const results = await predictBatch(
            paramsList.map(({ product: _p, ...rest }) => rest),
            3
        );

        const rows: PortfolioRow[] = paramsList.map((params, i) => {
            const res = results.find((r) => r.skuId === params.sku_id);
            const predicted = res?.result?.prediction ?? 0;
            const gap = predicted - params.product.quantity;
            let status: "stockout" | "ok" | "overstock" = "ok";
            if (res?.error) status = "ok";
            else if (predicted > params.product.quantity) status = "stockout";
            else if (params.product.quantity > predicted * 2) status = "overstock";

            return {
                product: params.product,
                skuId: params.sku_id,
                predictedDemand: predicted,
                currentStock: params.product.quantity,
                gap,
                status,
                error: res?.error,
            };
        });

        setPortfolioRows(rows);
        setPortfolioLoading(false);
    }, [products, portfolioCount, date, temp, rain, holiday]);

    // --- CSV Export (single) ---
    const handleExportSingle = useCallback(() => {
        if (prediction === null || !selectedProduct) return;
        const row = {
            Product: selectedProduct.name,
            Category: selectedProduct.category,
            Date: date,
            "Predicted Demand": Math.round(prediction),
            "Current Stock": selectedProduct.quantity,
            Gap: Math.round(prediction - selectedProduct.quantity),
        };
        exportToCsv(
            `forecast-${selectedProduct.name}-${date}.csv`,
            [row] as unknown as Record<string, unknown>[],
            ["Product", "Category", "Date", "Predicted Demand", "Current Stock", "Gap"]
        );
    }, [prediction, selectedProduct, date]);

    if (productsLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#6941C6] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        href="/overview"
                        className="flex items-center gap-1 text-sm text-[#667085] hover:text-[#101828] transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </Link>
                    <div className="flex items-center gap-2">
                        <TrendingUp size={20} className="text-[#6941C6]" />
                        <h1 className="text-xl font-semibold text-[#101828]">
                            Demand Forecast
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {prediction !== null && mode === "single" && (
                        <button
                            onClick={handleExportSingle}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#344054] border border-[#D0D5DD] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                        >
                            <Download size={14} />
                            Export CSV
                        </button>
                    )}
                </div>
            </div>

            {/* Mode Tabs */}
            <div className="flex gap-1 p-1 bg-[#F2F4F7] rounded-lg w-fit">
                {(["single", "portfolio"] as const).map((m) => (
                    <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${mode === m
                                ? "bg-white text-[#101828] shadow-sm"
                                : "text-[#667085] hover:text-[#101828]"
                            }`}
                    >
                        {m === "single" ? "Single Product" : "Portfolio"}
                    </button>
                ))}
            </div>

            {/* Single Mode */}
            {mode === "single" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ForecastControls
                        products={products}
                        selectedProductId={selectedProductId}
                        onProductChange={setSelectedProductId}
                        date={date}
                        onDateChange={setDate}
                        temp={temp}
                        onTempChange={setTemp}
                        rain={rain}
                        onRainChange={setRain}
                        holiday={holiday}
                        onHolidayChange={setHoliday}
                        onPredict={handlePredict}
                        loading={singleLoading}
                    />
                    <ForecastResult
                        prediction={prediction}
                        product={selectedProduct}
                        loading={singleLoading}
                        error={singleError}
                        modelMissing={modelMissing}
                    />
                </div>
            )}

            {/* Portfolio Mode */}
            {mode === "portfolio" && (
                <div className="space-y-6">
                    {/* Shared controls */}
                    <div className="bg-white rounded-xl border border-[#EAECF0] p-6 shadow-sm">
                        <h3 className="text-base font-semibold text-[#101828] mb-4">
                            Portfolio Settings
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#344054] mb-1.5">
                                    Forecast Date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full rounded-lg border border-[#D0D5DD] px-3 py-2.5 text-sm text-[#101828] bg-white focus:outline-none focus:ring-2 focus:ring-[#6941C6]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#344054] mb-1.5">
                                    Temp (°C)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={temp}
                                    onChange={(e) => setTemp(parseFloat(e.target.value) || 0)}
                                    className="w-full rounded-lg border border-[#D0D5DD] px-3 py-2.5 text-sm text-[#101828] bg-white focus:outline-none focus:ring-2 focus:ring-[#6941C6]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#344054] mb-1.5">
                                    Rain (mm)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={rain}
                                    onChange={(e) => setRain(parseFloat(e.target.value) || 0)}
                                    className="w-full rounded-lg border border-[#D0D5DD] px-3 py-2.5 text-sm text-[#101828] bg-white focus:outline-none focus:ring-2 focus:ring-[#6941C6]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#344054] mb-1.5">
                                    Products
                                </label>
                                <select
                                    value={portfolioCount}
                                    onChange={(e) => setPortfolioCount(Number(e.target.value))}
                                    className="w-full rounded-lg border border-[#D0D5DD] px-3 py-2.5 text-sm text-[#101828] bg-white focus:outline-none focus:ring-2 focus:ring-[#6941C6]"
                                >
                                    {[5, 10, 15, 20].map((n) => (
                                        <option key={n} value={n}>Top {n}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={handlePortfolioPredict}
                                    disabled={portfolioLoading || products.length === 0}
                                    className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-[#6941C6] hover:bg-[#53389E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                >
                                    {portfolioLoading && (
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    )}
                                    {portfolioLoading ? "Running…" : "Run Portfolio Forecast"}
                                </button>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-4">
                            <label className="flex items-center gap-2 text-sm text-[#344054]">
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={holiday}
                                    onClick={() => setHoliday(!holiday)}
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${holiday ? "bg-[#6941C6]" : "bg-[#D0D5DD]"
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow ${holiday ? "translate-x-4" : "translate-x-0.5"
                                            }`}
                                    />
                                </button>
                                Holiday
                            </label>
                        </div>
                    </div>

                    <PortfolioTable rows={portfolioRows} loading={portfolioLoading} />
                </div>
            )}
        </div>
    );
}
