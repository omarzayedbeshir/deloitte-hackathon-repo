// lib/analytics/forecastMetrics.ts

import type { Product, PortfolioRow } from "@/lib/types";

export interface StockoutRiskItem {
    product: Product;
    skuId: string;
    predictedDemand: number;
    currentStock: number;
    riskScore: number;          // predicted - stock (positive = risk)
    reorderQty: number;
    status: "stockout" | "ok" | "overstock";
}

/**
 * From portfolio predictions, compute stockout risk items sorted by highest risk.
 */
export function computeStockoutRisks(rows: PortfolioRow[]): StockoutRiskItem[] {
    return rows
        .filter((r) => !r.error)
        .map((r) => {
            const riskScore = r.predictedDemand - r.currentStock;
            const reorderQty = Math.max(0, riskScore);
            let status: "stockout" | "ok" | "overstock" = "ok";
            if (r.predictedDemand > r.currentStock) status = "stockout";
            else if (r.currentStock > r.predictedDemand * 2) status = "overstock";
            return {
                product: r.product,
                skuId: r.skuId,
                predictedDemand: r.predictedDemand,
                currentStock: r.currentStock,
                riskScore,
                reorderQty,
                status,
            };
        })
        .sort((a, b) => b.riskScore - a.riskScore);
}

/**
 * Generate insight text about stockout risks.
 */
export function stockoutInsightText(risks: StockoutRiskItem[]): string {
    const atRisk = risks.filter((r) => r.status === "stockout").length;
    const overstock = risks.filter((r) => r.status === "overstock").length;

    const parts: string[] = [];
    if (atRisk > 0) parts.push(`${atRisk} product${atRisk > 1 ? "s" : ""} likely to stock out within 7 days`);
    if (overstock > 0) parts.push(`${overstock} product${overstock > 1 ? "s" : ""} overstocked`);
    if (parts.length === 0) return "All analyzed products have adequate stock levels.";
    return parts.join(". ") + ".";
}
