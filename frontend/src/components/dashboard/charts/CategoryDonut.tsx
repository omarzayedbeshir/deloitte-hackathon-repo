"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Card from "@/components/ui/Card";
import { categories } from "@/lib/dashboardMock";

export default function CategoryDonut() {
    return (
        <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[#101828]">
                    Top Moving Category
                </h3>
                <select
                    className="text-sm text-[#667085] border border-[#D0D5DD] rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#6941C6]"
                    defaultValue="volume"
                    aria-label="Filter by"
                >
                    <option value="volume">By Volume</option>
                    <option value="revenue">By Revenue</option>
                </select>
            </div>

            <div className="h-[200px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={categories}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {categories.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #EAECF0",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                            formatter={(value) => [`${value}%`]}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Label */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <p className="text-sm font-medium text-[#101828]">E-Vapes</p>
                        <p className="text-xs text-[#667085]">30%</p>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 space-y-2">
                {categories.slice(0, 3).map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                            />
                            <span className="text-sm text-[#667085]">{category.name}</span>
                        </div>
                        <span className="text-sm font-medium text-[#101828]">
                            {category.value}%
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
}
