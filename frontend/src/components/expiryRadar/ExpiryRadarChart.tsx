// components/expiryRadar/ExpiryRadarChart.tsx
"use client";

import React, { useMemo, useState } from "react";
import type { ExpiryProduct } from "./expiryRadarUtils";
import { statusConfig } from "./expiryRadarUtils";

interface ExpiryRadarChartProps {
    items: ExpiryProduct[];
    /** Maximum days shown on the outer ring (default 90) */
    maxDays?: number;
}

const SIZE = 400;
const CX = SIZE / 2;
const CY = SIZE / 2;
const OUTER_R = 170;
const RINGS = [
    { days: 0, label: "Expired", r: 30 },
    { days: 7, label: "7 d", r: 70 },
    { days: 30, label: "30 d", r: 120 },
    { days: 90, label: "90 d", r: OUTER_R },
];

/** Map daysLeft → radial distance from centre */
function daysToRadius(daysLeft: number, maxDays: number): number {
    if (daysLeft <= 0) return RINGS[0].r * 0.6; // cluster expired near center
    const clamped = Math.min(daysLeft, maxDays);
    // linear interpolation between inner edge (RINGS[0].r) and outer edge (OUTER_R)
    return RINGS[0].r + ((clamped / maxDays) * (OUTER_R - RINGS[0].r));
}

export default function ExpiryRadarChart({
    items,
    maxDays = 90,
}: ExpiryRadarChartProps) {
    const [hovered, setHovered] = useState<string | null>(null);

    // Distribute products around the circle using golden angle for even spread
    const dots = useMemo(() => {
        const goldenAngle = 137.508; // degrees
        return items
            .filter((p) => p.daysLeft <= maxDays)
            .map((p, i) => {
                const angle = (i * goldenAngle * Math.PI) / 180;
                const r = daysToRadius(p.daysLeft, maxDays);
                const x = CX + r * Math.cos(angle);
                const y = CY + r * Math.sin(angle);
                return { ...p, x, y };
            });
    }, [items, maxDays]);

    return (
        <div className="relative w-full flex justify-center">
            <svg
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                className="w-full max-w-[420px]"
                role="img"
                aria-label="Expiry radar chart"
            >
                {/* Background rings */}
                {[...RINGS].reverse().map((ring) => (
                    <circle
                        key={ring.label}
                        cx={CX}
                        cy={CY}
                        r={ring.r}
                        fill="none"
                        stroke="#EAECF0"
                        strokeWidth={1}
                        strokeDasharray={ring.days === 0 ? "4 4" : undefined}
                    />
                ))}

                {/* Zone shading (expired core) */}
                <circle cx={CX} cy={CY} r={RINGS[0].r} fill="#FEF2F2" opacity={0.5} />

                {/* Ring labels */}
                {RINGS.map((ring) => (
                    <text
                        key={ring.label + "-label"}
                        x={CX + ring.r + 4}
                        y={CY - 4}
                        fontSize={10}
                        fill="#98A2B3"
                        fontFamily="Inter, sans-serif"
                    >
                        {ring.label}
                    </text>
                ))}

                {/* Cross-hairs */}
                <line
                    x1={CX}
                    y1={CY - OUTER_R - 10}
                    x2={CX}
                    y2={CY + OUTER_R + 10}
                    stroke="#EAECF0"
                    strokeWidth={0.5}
                />
                <line
                    x1={CX - OUTER_R - 10}
                    y1={CY}
                    x2={CX + OUTER_R + 10}
                    y2={CY}
                    stroke="#EAECF0"
                    strokeWidth={0.5}
                />

                {/* Product dots */}
                {dots.map((d) => {
                    const cfg = statusConfig[d.status];
                    const isHovered = hovered === d.id;
                    return (
                        <g key={d.id}>
                            {/* Pulse ring on hover */}
                            {isHovered && (
                                <circle
                                    cx={d.x}
                                    cy={d.y}
                                    r={12}
                                    fill={cfg.dot}
                                    opacity={0.15}
                                >
                                    <animate
                                        attributeName="r"
                                        from="8"
                                        to="16"
                                        dur="0.8s"
                                        repeatCount="indefinite"
                                    />
                                    <animate
                                        attributeName="opacity"
                                        from="0.3"
                                        to="0"
                                        dur="0.8s"
                                        repeatCount="indefinite"
                                    />
                                </circle>
                            )}
                            <circle
                                cx={d.x}
                                cy={d.y}
                                r={isHovered ? 7 : 5}
                                fill={cfg.dot}
                                stroke="white"
                                strokeWidth={2}
                                className="cursor-pointer transition-all duration-150"
                                onMouseEnter={() => setHovered(d.id)}
                                onMouseLeave={() => setHovered(null)}
                            />
                        </g>
                    );
                })}
            </svg>

            {/* Tooltip */}
            {hovered && (() => {
                const d = dots.find((p) => p.id === hovered);
                if (!d) return null;
                const cfg = statusConfig[d.status];
                return (
                    <div
                        className="absolute pointer-events-none bg-white border border-[#EAECF0] rounded-xl shadow-lg px-4 py-3 text-sm z-10"
                        style={{
                            left: "50%",
                            top: 12,
                            transform: "translateX(-50%)",
                        }}
                    >
                        <p className="font-semibold text-gray-900">{d.name}</p>
                        <p className="text-gray-500">
                            {d.category} · Qty {d.quantity}
                        </p>
                        <p className="mt-1">
                            <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
                            >
                                {d.daysLeft <= 0
                                    ? `Expired ${Math.abs(d.daysLeft)}d ago`
                                    : `${d.daysLeft}d left`}
                            </span>
                        </p>
                    </div>
                );
            })()}
        </div>
    );
}
