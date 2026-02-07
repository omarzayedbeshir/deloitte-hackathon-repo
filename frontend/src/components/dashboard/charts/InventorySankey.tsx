"use client";

import React from "react";
import Card from "@/components/ui/Card";
import IconButton from "@/components/ui/IconButton";

interface SankeyNode {
    name: string;
    percentage: number;
}

const leftNodes: SankeyNode[] = [
    { name: "Beaf (Austin)", percentage: 59.7 },
    { name: "Beaf (Crosby)", percentage: 13 },
    { name: "Beaf (Malibu)", percentage: 12.7 },
    { name: "Beaf (Muscat)", percentage: 7.3 },
    { name: "Beaf (Cranbury)", percentage: 5.2 },
];

const rightNodes: SankeyNode[] = [
    { name: "Beaf (Baytown)", percentage: 13.9 },
    { name: "Beaf (Kirby)", percentage: 2.6 },
    { name: "Beaf (Kirby)", percentage: 1.8 },
    { name: "Beaf (Irving)", percentage: 1.3 },
    { name: "Beaf (Huston)", percentage: 4 },
];

const PRIMARY_COLOR = "#6941C6";
const BAND_COLOR = "rgba(105, 65, 198, 0.15)";
const ROW_HEIGHT = 56;
const BLOCK_WIDTH = 12;
const NODE_COUNT = 5;

export default function InventorySankey() {
    const totalHeight = NODE_COUNT * ROW_HEIGHT;
    const centerY = totalHeight / 2;

    // Calculate band thickness based on percentage (scale factor for visual appeal)
    const getThickness = (percentage: number) => Math.max(percentage * 0.7, 8);

    // Generate cubic bezier path for a filled band
    const generateBandPath = (
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        thickness: number
    ): string => {
        const halfThick = thickness / 2;
        const cpOffset = (x2 - x1) * 0.5;

        // Top edge: left to right
        const topStartY = y1 - halfThick;
        const topEndY = y2 - halfThick;
        // Bottom edge: right to left
        const bottomStartY = y2 + halfThick;
        const bottomEndY = y1 + halfThick;

        return `
      M ${x1} ${topStartY}
      C ${x1 + cpOffset} ${topStartY}, ${x2 - cpOffset} ${topEndY}, ${x2} ${topEndY}
      L ${x2} ${bottomStartY}
      C ${x2 - cpOffset} ${bottomStartY}, ${x1 + cpOffset} ${bottomEndY}, ${x1} ${bottomEndY}
      Z
    `;
    };

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-[#101828]">
                    Inventory Movement Landscape
                </h3>
                <IconButton aria-label="Collapse chart">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M5 12.5L10 7.5L15 12.5"
                            stroke="currentColor"
                            strokeWidth="1.67"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </IconButton>
            </div>

            {/* Sankey Visualization */}
            <div className="relative flex items-stretch" style={{ minHeight: `${totalHeight}px` }}>
                {/* Left Labels Column */}
                <div className="flex flex-col justify-between flex-shrink-0 w-[160px] py-1">
                    {leftNodes.map((node, index) => (
                        <div
                            key={`left-label-${index}`}
                            className="flex items-center"
                            style={{ height: `${ROW_HEIGHT}px` }}
                        >
                            <p className="text-sm text-[#344054] truncate pr-2">{node.name}</p>
                        </div>
                    ))}
                </div>

                {/* SVG Sankey Area */}
                <div className="flex-1 relative">
                    <svg
                        className="w-full h-full"
                        viewBox="0 0 600 280"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        {/* Left source blocks and bands */}
                        {leftNodes.map((node, index) => {
                            const y = index * ROW_HEIGHT + ROW_HEIGHT / 2;
                            const thickness = getThickness(node.percentage);
                            const blockX = 0;
                            const bandStartX = BLOCK_WIDTH;
                            const bandEndX = 260;
                            const centerNodeY = centerY;

                            return (
                                <g key={`left-${index}`}>
                                    {/* Source block */}
                                    <rect
                                        x={blockX}
                                        y={y - ROW_HEIGHT / 2 + 4}
                                        width={BLOCK_WIDTH}
                                        height={ROW_HEIGHT - 8}
                                        fill={PRIMARY_COLOR}
                                    />
                                    {/* Band from source to center */}
                                    <path
                                        d={generateBandPath(bandStartX, y, bandEndX, centerNodeY, thickness)}
                                        fill={BAND_COLOR}
                                    />
                                    {/* Percentage label on band */}
                                    <text
                                        x={bandStartX + 40}
                                        y={y + 4}
                                        fill="#344054"
                                        fontSize="13"
                                        fontWeight="500"
                                    >
                                        {node.percentage}%
                                    </text>
                                </g>
                            );
                        })}

                        {/* Center WAREHOUSE block */}
                        <rect
                            x={260}
                            y={20}
                            width={80}
                            height={totalHeight - 40}
                            fill={PRIMARY_COLOR}
                            rx={0}
                        />
                        {/* WAREHOUSE text vertically */}
                        <text
                            x={300}
                            y={centerY}
                            fill="white"
                            fontSize="14"
                            fontWeight="600"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{ letterSpacing: "0.15em" }}
                        >
                            <tspan x="300" dy="-70">W</tspan>
                            <tspan x="300" dy="20">A</tspan>
                            <tspan x="300" dy="20">R</tspan>
                            <tspan x="300" dy="20">E</tspan>
                            <tspan x="300" dy="20">H</tspan>
                            <tspan x="300" dy="20">O</tspan>
                            <tspan x="300" dy="20">U</tspan>
                            <tspan x="300" dy="20">S</tspan>
                            <tspan x="300" dy="20">E</tspan>
                        </text>

                        {/* Right destination blocks and bands */}
                        {rightNodes.map((node, index) => {
                            const y = index * ROW_HEIGHT + ROW_HEIGHT / 2;
                            const thickness = getThickness(node.percentage);
                            const bandStartX = 340;
                            const bandEndX = 588;
                            const blockX = 588;
                            const centerNodeY = centerY;

                            return (
                                <g key={`right-${index}`}>
                                    {/* Band from center to destination */}
                                    <path
                                        d={generateBandPath(bandStartX, centerNodeY, bandEndX, y, thickness)}
                                        fill={BAND_COLOR}
                                    />
                                    {/* Destination block */}
                                    <rect
                                        x={blockX}
                                        y={y - ROW_HEIGHT / 2 + 4}
                                        width={BLOCK_WIDTH}
                                        height={ROW_HEIGHT - 8}
                                        fill={PRIMARY_COLOR}
                                    />
                                    {/* Percentage label on band */}
                                    <text
                                        x={bandEndX - 45}
                                        y={y + 4}
                                        fill="#344054"
                                        fontSize="13"
                                        fontWeight="500"
                                        textAnchor="end"
                                    >
                                        {node.percentage}%
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Right Labels Column */}
                <div className="flex flex-col justify-between flex-shrink-0 w-[160px] py-1">
                    {rightNodes.map((node, index) => (
                        <div
                            key={`right-label-${index}`}
                            className="flex items-center justify-end"
                            style={{ height: `${ROW_HEIGHT}px` }}
                        >
                            <p className="text-sm text-[#344054] truncate pl-2 text-right">
                                {node.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
