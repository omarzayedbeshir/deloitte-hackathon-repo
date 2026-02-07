// components/transactions/TransactionsKpiRow.tsx
"use client";

import React from "react";
import StatCard from "@/components/ui/StatCard";
import type { TransactionKpi } from "@/lib/types";

interface TransactionsKpiRowProps {
    kpis: TransactionKpi[];
}

export default function TransactionsKpiRow({ kpis }: TransactionsKpiRowProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {kpis.map((kpi) => (
                <StatCard
                    key={kpi.key}
                    title={kpi.label}
                    value={String(kpi.value)}
                />
            ))}
        </div>
    );
}
