// app/(dashboard)/overview/page.tsx
"use client";

import React, { useState } from "react";

import { useProducts } from "@/lib/ProductsContext";
import { useTransactions } from "@/lib/TransactionsContext";

import OverviewKpis from "@/components/overview/OverviewKpis";
import SalesInventoryChart from "@/components/overview/SalesInventoryChart";
import InventoryHealthChart from "@/components/overview/InventoryHealthChart";
import StockoutRiskChart from "@/components/overview/StockoutRiskChart";
import ExpiryDonutChart from "@/components/overview/ExpiryDonutChart";
import CategoryDistributionChart from "@/components/overview/CategoryDistributionChart";

import type { RangeKey } from "@/lib/analytics/overviewMetrics";

const rangeOptions: RangeKey[] = ["1d", "7d", "1m", "3m", "6m", "1y", "3y", "5y"];

export default function OverviewPage() {
    const { products, loading: productsLoading } = useProducts();
    const { transactions, loading: txLoading } = useTransactions();
    const [rangeKey, setRangeKey] = useState<RangeKey>("1m");

    return (
        <div className="space-y-6">
            {/* Date-range chip bar */}
            <div className="flex flex-wrap items-center gap-2">
                {rangeOptions.map((key) => (
                    <button
                        key={key}
                        onClick={() => setRangeKey(key)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${rangeKey === key
                                ? "bg-[#6941C6] text-white"
                                : "bg-white text-[#344054] border border-[#D0D5DD] hover:bg-[#F9FAFB]"
                            }`}
                    >
                        {key}
                    </button>
                ))}
            </div>

            {/* KPI Cards Grid — real data */}
            <OverviewKpis
                products={products}
                transactions={transactions}
                productsLoading={productsLoading}
                txLoading={txLoading}
                rangeKey={rangeKey}
            />

            {/* Monthly Sales Chart — real data */}
            <SalesInventoryChart
                transactions={transactions}
                loading={txLoading}
                rangeKey={rangeKey}
            />

            {/* Inventory Health — real data */}
            <InventoryHealthChart
                products={products}
                transactions={transactions}
                loading={productsLoading || txLoading}
            />

            {/* Stockout Risks — forecast powered */}
            <StockoutRiskChart products={products} loading={productsLoading} />

            {/* Bottom Row: Expiry Donut + Category Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <ExpiryDonutChart products={products} loading={productsLoading} />
                <CategoryDistributionChart products={products} loading={productsLoading} />
            </div>
        </div>
    );
}
