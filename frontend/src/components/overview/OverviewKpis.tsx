// components/overview/OverviewKpis.tsx
"use client";

import React, { useMemo } from "react";
import KpiCard from "@/components/dashboard/KpiCard";
import type { Product, Transaction, KpiData } from "@/lib/types";
import {
    computeKpis,
    rangeFromKey,
    type RangeKey,
} from "@/lib/analytics/overviewMetrics";

interface OverviewKpisProps {
    products: Product[];
    transactions: Transaction[];
    productsLoading: boolean;
    txLoading: boolean;
    rangeKey: RangeKey;
}

/** Skeleton matching the KpiCard dimensions */
function KpiSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-[#EAECF0] p-5 animate-pulse">
            <div className="h-3 w-32 bg-[#F2F4F7] rounded mb-3" />
            <div className="h-8 w-24 bg-[#F2F4F7] rounded mb-3" />
            <div className="h-3 w-20 bg-[#F2F4F7] rounded" />
        </div>
    );
}

export default function OverviewKpis({
    products,
    transactions,
    productsLoading,
    txLoading,
    rangeKey,
}: OverviewKpisProps) {
    const range = useMemo(() => rangeFromKey(rangeKey), [rangeKey]);

    const { cards, hasTxData } = useMemo(
        () => computeKpis(products, transactions, range),
        [products, transactions, range]
    );

    const loading = productsLoading || txLoading;

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <KpiSkeleton key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {cards.map((kpi: KpiData) => (
                    <KpiCard key={kpi.id} {...kpi} />
                ))}
            </div>
            {!hasTxData && (
                <p className="text-xs text-[#667085] text-center">
                    Sales metrics show &quot;—&quot; because no transactions exist for the selected period. Inventory metrics show current snapshot.
                </p>
            )}
        </div>
    );
}
