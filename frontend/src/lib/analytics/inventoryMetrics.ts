// lib/analytics/inventoryMetrics.ts

import type { Product, Transaction } from "@/lib/types";

export interface DailyPoint {
    date: string;   // "YYYY-MM-DD"
    label: string;  // "Jan 15"
    value: number;
}

/**
 * Compute daily total units sold from transactions over the last N days.
 * Returns an array sorted chronologically.
 */
export function dailySalesFromTransactions(
    transactions: Transaction[],
    days = 30
): DailyPoint[] {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - days);

    const sales = transactions.filter(
        (t) => t.transaction_type === "sale" && new Date(t.time_of_transaction) >= cutoff
    );

    const map = new Map<string, number>();
    for (let d = new Date(cutoff); d <= now; d.setDate(d.getDate() + 1)) {
        map.set(d.toISOString().slice(0, 10), 0);
    }

    for (const t of sales) {
        const key = new Date(t.time_of_transaction).toISOString().slice(0, 10);
        if (map.has(key)) {
            map.set(key, (map.get(key) ?? 0) + t.product_quantity);
        }
    }

    return Array.from(map.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, value]) => ({
            date,
            label: formatDateLabel(date),
            value,
        }));
}

/**
 * Snapshot-based: inventory value per category (qty * price).
 */
export function inventoryValueSnapshot(products: Product[]): DailyPoint[] {
    const today = new Date().toISOString().slice(0, 10);
    const totalValue = products.reduce((s, p) => s + p.quantity * p.price, 0);
    return [{ date: today, label: "Current", value: Math.round(totalValue * 100) / 100 }];
}

/**
 * Total inventory units.
 */
export function totalInventoryUnits(products: Product[]): number {
    return products.reduce((s, p) => s + p.quantity, 0);
}

/**
 * Total inventory value.
 */
export function totalInventoryValue(products: Product[]): number {
    return products.reduce((s, p) => s + p.quantity * p.price, 0);
}

/**
 * Category distribution by quantity.
 */
export interface CategorySlice {
    name: string;
    value: number;
    color: string;
}

const PALETTE = ["#6941C6", "#7F56D9", "#B692F6", "#D6BBFB", "#F4EBFF", "#9E77ED", "#53389E", "#E9D7FE"];

export function categoryDistribution(products: Product[]): CategorySlice[] {
    const map = new Map<string, number>();
    for (const p of products) {
        const cat = p.category || "Uncategorized";
        map.set(cat, (map.get(cat) ?? 0) + p.quantity);
    }

    return Array.from(map.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, value], i) => ({
            name,
            value,
            color: PALETTE[i % PALETTE.length],
        }));
}

function formatDateLabel(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
