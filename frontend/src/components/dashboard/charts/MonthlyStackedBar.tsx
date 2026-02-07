"use client";

import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { monthlySales } from "@/lib/dashboardMock";
import Card from "@/components/ui/Card";
import IconButton from "@/components/ui/IconButton";

export default function MonthlyStackedBar() {
    const data = monthlySales.map((item) => ({
        ...item,
        name: `${item.month}`,
    }));

    return (
        <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h3 className="text-base font-semibold text-[#101828]">
                    Monthly Sales Vs Inventory Analysis
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

            {/* Legend */}
            <div className="flex items-center justify-end gap-6 mb-4">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4E5BA6]" />
                    <span className="text-sm text-[#667085]">Gross Sales Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#F79009]" />
                    <span className="text-sm text-[#667085]">Inventory Moved</span>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barCategoryGap="20%">
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAECF0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#667085", fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#667085", fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #EAECF0",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                        />
                        <Bar
                            dataKey="grossSalesRevenue"
                            stackId="a"
                            fill="#4E5BA6"
                            radius={[0, 0, 0, 0]}
                            name="Gross Sales Revenue"
                        />
                        <Bar
                            dataKey="inventoryMoved"
                            stackId="a"
                            fill="#F79009"
                            radius={[4, 4, 0, 0]}
                            name="Inventory Moved"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Year Labels */}
            <div className="flex justify-center gap-8 mt-4">
                <span className="text-sm font-medium text-[#F79009]">2023</span>
                <span className="text-sm font-medium text-[#F79009]">2024</span>
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-between mt-4">
                <IconButton aria-label="Previous" className="text-[#12B76A]">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                        <path
                            d="M14 8L10 12L14 16"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </IconButton>
                <IconButton aria-label="Next" className="text-[#F79009]">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                        <path
                            d="M10 8L14 12L10 16"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </IconButton>
            </div>
        </Card>
    );
}
