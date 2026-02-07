// lib/analytics/overviewMetrics.ts

import type { Product, Transaction, KpiData } from "@/lib/types";

// ----------------------------------------------------------------
// Date-range helpers
// ----------------------------------------------------------------
export type RangeKey = "1d" | "7d" | "1m" | "3m" | "6m" | "1y" | "3y" | "5y";

export interface DateRange {
    start: Date;
    end: Date;
}

/** Map a chip label to a concrete (start, end=today) pair. */
export function rangeFromKey(key: RangeKey): DateRange {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);

    switch (key) {
        case "1d":
            start.setDate(start.getDate() - 1);
            break;
        case "7d":
            start.setDate(start.getDate() - 7);
            break;
        case "1m":
            start.setMonth(start.getMonth() - 1);
            break;
        case "3m":
            start.setMonth(start.getMonth() - 3);
            break;
        case "6m":
            start.setMonth(start.getMonth() - 6);
            break;
        case "1y":
            start.setFullYear(start.getFullYear() - 1);
            break;
        case "3y":
            start.setFullYear(start.getFullYear() - 3);
            break;
        case "5y":
            start.setFullYear(start.getFullYear() - 5);
            break;
    }
    start.setHours(0, 0, 0, 0);
    return { start, end };
}

/** Previous period of equal length immediately preceding the current range. */
export function previousRange(range: DateRange): DateRange {
    const durationMs = range.end.getTime() - range.start.getTime();
    const prevEnd = new Date(range.start.getTime() - 1);
    prevEnd.setHours(23, 59, 59, 999);
    const prevStart = new Date(prevEnd.getTime() - durationMs);
    prevStart.setHours(0, 0, 0, 0);
    return { start: prevStart, end: prevEnd };
}

// ----------------------------------------------------------------
// Filtering
// ----------------------------------------------------------------
function txInRange(transactions: Transaction[], range: DateRange): Transaction[] {
    return transactions.filter((t) => {
        const d = new Date(t.time_of_transaction);
        return d >= range.start && d <= range.end;
    });
}

function salesInRange(transactions: Transaction[], range: DateRange): Transaction[] {
    return txInRange(transactions, range).filter((t) => t.transaction_type === "sale");
}

// ----------------------------------------------------------------
// Individual metric computations
// ----------------------------------------------------------------
function sumRevenue(txs: Transaction[]): number {
    return txs
        .filter((t) => t.transaction_type === "sale")
        .reduce((s, t) => s + Math.abs(t.total_price), 0);
}

function avgOrderValue(txs: Transaction[]): number {
    const sales = txs.filter((t) => t.transaction_type === "sale");
    if (sales.length === 0) return 0;
    const total = sales.reduce((s, t) => s + Math.abs(t.total_price), 0);
    return total / sales.length;
}

function transactionCount(txs: Transaction[]): number {
    return txs.length;
}

function grossProfitMargin(revenue: number): number {
    // MVP: assume 30% margin (COGS = 70% of revenue)
    if (revenue === 0) return 0;
    const estimatedCost = revenue * 0.7;
    return ((revenue - estimatedCost) / revenue) * 100; // 30%
}

// ----------------------------------------------------------------
// Format helpers
// ----------------------------------------------------------------
function fmtCurrency(v: number): string {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}m`;
    if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}k`;
    return `$${v.toFixed(0)}`;
}

function pctChange(current: number, previous: number): { percent: number; direction: "up" | "down" } {
    if (previous === 0 && current > 0) return { percent: 100, direction: "up" };
    if (previous === 0 && current === 0) return { percent: 0, direction: "up" };
    if (previous === 0) return { percent: 100, direction: "down" };
    const pct = ((current - previous) / Math.abs(previous)) * 100;
    return { percent: Math.abs(Math.round(pct * 10) / 10), direction: pct >= 0 ? "up" : "down" };
}

// ----------------------------------------------------------------
// Sparkline builders
// ----------------------------------------------------------------
function dailyRevenueSeries(txs: Transaction[], range: DateRange): number[] {
    const sales = txs.filter((t) => t.transaction_type === "sale");
    const map = new Map<string, number>();
    // Fill all days in range
    const d = new Date(range.start);
    while (d <= range.end) {
        map.set(d.toISOString().slice(0, 10), 0);
        d.setDate(d.getDate() + 1);
    }
    for (const t of sales) {
        const key = new Date(t.time_of_transaction).toISOString().slice(0, 10);
        if (map.has(key)) map.set(key, (map.get(key) ?? 0) + Math.abs(t.total_price));
    }
    const entries = Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
    // Downsample to ~12 points for sparkline
    return downsample(entries.map(([, v]) => v), 12);
}

function dailyCountSeries(txs: Transaction[], range: DateRange): number[] {
    const map = new Map<string, number>();
    const d = new Date(range.start);
    while (d <= range.end) {
        map.set(d.toISOString().slice(0, 10), 0);
        d.setDate(d.getDate() + 1);
    }
    for (const t of txs) {
        const key = new Date(t.time_of_transaction).toISOString().slice(0, 10);
        if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
    }
    const entries = Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
    return downsample(entries.map(([, v]) => v), 12);
}

function downsample(data: number[], targetLen: number): number[] {
    if (data.length <= targetLen) return data;
    const step = data.length / targetLen;
    const result: number[] = [];
    for (let i = 0; i < targetLen; i++) {
        const startIdx = Math.floor(i * step);
        const endIdx = Math.floor((i + 1) * step);
        let sum = 0;
        for (let j = startIdx; j < endIdx; j++) sum += data[j];
        result.push(Math.round((sum / (endIdx - startIdx)) * 100) / 100);
    }
    return result;
}

// ----------------------------------------------------------------
// Main KPI computation
// ----------------------------------------------------------------
export interface ComputedKpis {
    cards: KpiData[];
    hasTxData: boolean;
}

export function computeKpis(
    products: Product[],
    transactions: Transaction[],
    range: DateRange
): ComputedKpis {
    const prev = previousRange(range);

    const curTxs = txInRange(transactions, range);
    const prevTxs = txInRange(transactions, prev);

    const curRevenue = sumRevenue(curTxs);
    const prevRevenue = sumRevenue(prevTxs);

    const curAvg = avgOrderValue(curTxs);
    const prevAvg = avgOrderValue(prevTxs);

    const curCount = transactionCount(curTxs);
    const prevCount = transactionCount(prevTxs);

    const curMargin = grossProfitMargin(curRevenue);
    const prevMarginNum = grossProfitMargin(prevRevenue);

    const invUnits = products.reduce((s, p) => s + p.quantity, 0);
    const invValue = products.reduce((s, p) => s + p.quantity * p.price, 0);

    const hasTxData = transactions.length > 0 && curTxs.length > 0;

    const revChange = pctChange(curRevenue, prevRevenue);
    const avgChange = pctChange(curAvg, prevAvg);
    const countChange = pctChange(curCount, prevCount);
    const marginChange = pctChange(curMargin, prevMarginNum);

    const cards: KpiData[] = [
        {
            id: "avg-order-volume",
            title: "Average Order Volume",
            value: hasTxData ? fmtCurrency(curAvg) : "—",
            deltaPercent: hasTxData ? avgChange.percent : 0,
            deltaDirection: hasTxData ? avgChange.direction : "up",
            sparklineData: hasTxData
                ? dailyRevenueSeries(curTxs, range)
                : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: "transaction-count",
            title: "Transaction Count (Orders)",
            value: hasTxData ? curCount.toLocaleString() : "—",
            deltaPercent: hasTxData ? countChange.percent : 0,
            deltaDirection: hasTxData ? countChange.direction : "up",
            sparklineData: hasTxData
                ? dailyCountSeries(curTxs, range)
                : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: "inventory-units",
            title: "Total Inventory Units",
            value: invUnits.toLocaleString(),
            deltaPercent: 0,
            deltaDirection: "up",
            sparklineData: [invUnits, invUnits, invUnits, invUnits, invUnits, invUnits],
        },
        {
            id: "gross-profit-margin",
            title: "Gross Profit Margin",
            value: hasTxData ? `${curMargin.toFixed(1)}%` : "—",
            deltaPercent: hasTxData ? marginChange.percent : 0,
            deltaDirection: hasTxData ? marginChange.direction : "up",
            sparklineData: hasTxData
                ? dailyRevenueSeries(curTxs, range).map((v) => v * 0.3) // 30% margin proxy
                : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: "inventory-value",
            title: "Total Inventory Value",
            value: fmtCurrency(invValue),
            deltaPercent: 0,
            deltaDirection: "up",
            sparklineData: [invValue, invValue, invValue, invValue, invValue, invValue],
        },
        {
            id: "total-net-revenue",
            title: "Total Net Revenue",
            value: hasTxData ? fmtCurrency(curRevenue) : "—",
            deltaPercent: hasTxData ? revChange.percent : 0,
            deltaDirection: hasTxData ? revChange.direction : "up",
            sparklineData: hasTxData
                ? dailyRevenueSeries(curTxs, range)
                : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
    ];

    return { cards, hasTxData };
}

// ----------------------------------------------------------------
// Monthly chart series builder
// ----------------------------------------------------------------
export interface MonthlyBar {
    label: string;       // "Jan 2024" or "Jan"
    month: string;       // "Jan"
    year: number;
    grossSalesRevenue: number;
    inventoryMoved: number;
}

export function buildMonthlySeries(
    transactions: Transaction[],
    range: DateRange
): MonthlyBar[] {
    const sales = salesInRange(transactions, range);

    // Group by YYYY-MM
    const map = new Map<string, { revenue: number; units: number; year: number; month: string }>();

    // Pre-fill months in range
    const d = new Date(range.start);
    d.setDate(1);
    while (d <= range.end) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const monthName = d.toLocaleString("en-US", { month: "short" });
        map.set(key, { revenue: 0, units: 0, year: d.getFullYear(), month: monthName });
        d.setMonth(d.getMonth() + 1);
    }

    for (const t of sales) {
        const dt = new Date(t.time_of_transaction);
        const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
        const existing = map.get(key);
        if (existing) {
            existing.revenue += Math.abs(t.total_price);
            existing.units += t.product_quantity;
        } else {
            const monthName = dt.toLocaleString("en-US", { month: "short" });
            map.set(key, {
                revenue: Math.abs(t.total_price),
                units: t.product_quantity,
                year: dt.getFullYear(),
                month: monthName,
            });
        }
    }

    const sorted = Array.from(map.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, val]) => ({
            label: val.month,
            month: val.month,
            year: val.year,
            grossSalesRevenue: Math.round(val.revenue * 100) / 100,
            inventoryMoved: val.units,
        }));

    return sorted;
}

/**
 * Extract distinct years from monthly bars for year markers.
 */
export function extractYears(bars: MonthlyBar[]): number[] {
    const years = new Set(bars.map((b) => b.year));
    return Array.from(years).sort();
}
