// lib/analytics/expiryMetrics.ts

import type { Product } from "@/lib/types";

export interface ExpiryCounts {
    expired: number;
    within7d: number;
    within30d: number;
    safe: number;
}

export interface ExpirySlice {
    name: string;
    value: number;
    color: string;
}

/**
 * Classify products into expiry buckets.
 */
export function computeExpiryCounts(products: Product[]): ExpiryCounts {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    let expired = 0, within7d = 0, within30d = 0, safe = 0;

    for (const p of products) {
        if (!p.expiry) { safe++; continue; }
        const exp = new Date(p.expiry);
        exp.setHours(0, 0, 0, 0);
        const diff = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (diff <= 0) expired++;
        else if (diff <= 7) within7d++;
        else if (diff <= 30) within30d++;
        else safe++;
    }

    return { expired, within7d, within30d, safe };
}

/**
 * Return donut-ready slices from expiry counts.
 */
export function expirySlices(counts: ExpiryCounts): ExpirySlice[] {
    return [
        { name: "Expired", value: counts.expired, color: "#EF4444" },
        { name: "≤ 7 days", value: counts.within7d, color: "#F97316" },
        { name: "≤ 30 days", value: counts.within30d, color: "#EAB308" },
        { name: "Safe", value: counts.safe, color: "#22C55E" },
    ].filter((s) => s.value > 0);
}

/**
 * Generate a short insight text about expiry status.
 */
export function expiryInsightText(counts: ExpiryCounts): string {
    const alerts: string[] = [];
    if (counts.expired > 0) alerts.push(`${counts.expired} item${counts.expired > 1 ? "s" : ""} expired`);
    if (counts.within7d > 0) alerts.push(`${counts.within7d} expiring within 7 days`);
    if (counts.within30d > 0) alerts.push(`${counts.within30d} expiring within 30 days`);
    if (alerts.length === 0) return "All products have safe expiry dates.";
    return alerts.join(", ") + " — consider promotions or markdowns.";
}
