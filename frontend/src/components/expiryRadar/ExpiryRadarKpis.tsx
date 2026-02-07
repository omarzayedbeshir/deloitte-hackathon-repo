// components/expiryRadar/ExpiryRadarKpis.tsx
"use client";

import React from "react";
import StatCard from "@/components/ui/StatCard";
import type { ExpiryProduct } from "./expiryRadarUtils";
import { countByStatus, countWithinDays } from "./expiryRadarUtils";

interface ExpiryRadarKpisProps {
    items: ExpiryProduct[];
}

export default function ExpiryRadarKpis({ items }: ExpiryRadarKpisProps) {
    const expired = countByStatus(items, "expired");
    const within7 = countWithinDays(items, 7);
    const within30 = countWithinDays(items, 30);
    const within90 = countWithinDays(items, 90);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Expired" value={expired} highlighted />
            <StatCard title="≤ 7 Days" value={within7} />
            <StatCard title="≤ 30 Days" value={within30} />
            <StatCard title="≤ 90 Days" value={within90} />
        </div>
    );
}
