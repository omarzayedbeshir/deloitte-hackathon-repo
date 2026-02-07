// components/products/ProductsKpiRow.tsx
"use client";

import React from "react";
import StatCard from "@/components/ui/StatCard";
import type { ProductKpi } from "@/lib/types";

interface ProductsKpiRowProps {
  kpis: ProductKpi[];
}

export default function ProductsKpiRow({ kpis }: ProductsKpiRowProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {kpis.map((kpi, index) => (
        <StatCard
          key={kpi.key}
          title={kpi.label}
          value={kpi.value}
          highlighted={index === 0}
        />
      ))}
    </div>
  );
}
