"use client";

import React from "react";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import { products } from "@/lib/dashboardMock";

export default function ProductBars() {
    return (
        <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[#101828]">
                    Most Sold Products
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

            <div className="space-y-4">
                {products.map((product) => (
                    <div key={product.name} className="space-y-1.5">
                        <span className="text-sm text-[#344054]">{product.name}</span>
                        <ProgressBar value={product.percentage} />
                    </div>
                ))}
            </div>
        </Card>
    );
}
