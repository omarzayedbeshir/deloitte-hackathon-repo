// components/expiryRadar/expiryRadarUtils.ts

import type { Product } from "@/lib/types";

export type ExpiryStatus = "expired" | "critical" | "warning" | "safe";

export interface ExpiryProduct extends Product {
    daysLeft: number;
    status: ExpiryStatus;
}

/** Number of days from today until the product expires (negative = already expired) */
export function daysToExpiry(expiry: string): number {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const exp = new Date(expiry);
    exp.setHours(0, 0, 0, 0);
    return Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

/** Classify a product by how close its expiry date is */
export function getExpiryStatus(daysLeft: number): ExpiryStatus {
    if (daysLeft <= 0) return "expired";
    if (daysLeft <= 7) return "critical";
    if (daysLeft <= 30) return "warning";
    return "safe";
}

/** Badge colours keyed by status */
export const statusConfig: Record<
    ExpiryStatus,
    { label: string; bg: string; text: string; dot: string }
> = {
    expired: {
        label: "Expired",
        bg: "bg-red-50",
        text: "text-red-700",
        dot: "#EF4444",
    },
    critical: {
        label: "≤ 7 days",
        bg: "bg-orange-50",
        text: "text-orange-700",
        dot: "#F97316",
    },
    warning: {
        label: "≤ 30 days",
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        dot: "#EAB308",
    },
    safe: {
        label: "Safe",
        bg: "bg-green-50",
        text: "text-green-700",
        dot: "#22C55E",
    },
};

/** Enrich products with daysLeft + status and sort soonest-first */
export function enrichProducts(products: Product[]): ExpiryProduct[] {
    return products
        .map((p) => {
            const daysLeft = daysToExpiry(p.expiry);
            return { ...p, daysLeft, status: getExpiryStatus(daysLeft) };
        })
        .sort((a, b) => a.daysLeft - b.daysLeft);
}

/** Count products matching a status */
export function countByStatus(
    items: ExpiryProduct[],
    status: ExpiryStatus
): number {
    return items.filter((i) => i.status === status).length;
}

/** Count products expiring within N days (includes already-expired) */
export function countWithinDays(
    items: ExpiryProduct[],
    days: number
): number {
    return items.filter((i) => i.daysLeft <= days).length;
}
