// components/expiryRadar/ExpiryRadarPageClient.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Download, Search } from "lucide-react";
import { useProducts } from "@/lib/ProductsContext";
import { fetchCategories } from "@/lib/api/endpoints";
import { exportToCsv } from "@/lib/csv";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";

import ExpiryRadarKpis from "./ExpiryRadarKpis";
import ExpiryRadarChart from "./ExpiryRadarChart";
import ExpiryRadarList from "./ExpiryRadarList";
import { enrichProducts } from "./expiryRadarUtils";
import type { ExpiryProduct } from "./expiryRadarUtils";

const rangeTabs = [
    { value: "7", label: "7 Days" },
    { value: "30", label: "30 Days" },
    { value: "90", label: "90 Days" },
    { value: "all", label: "All" },
];

export default function ExpiryRadarPageClient() {
    const { products } = useProducts();

    // Filters
    const [range, setRange] = useState("90");
    const [category, setCategory] = useState("");
    const [search, setSearch] = useState("");
    const [inStockOnly, setInStockOnly] = useState(false);

    // Fetch category names from API
    const [categoryNames, setCategoryNames] = useState<string[]>([]);
    useEffect(() => {
        fetchCategories()
            .then((cats) =>
                setCategoryNames(
                    cats
                        .filter((c) => c.status === "active")
                        .map((c) => c.name)
                        .sort()
                )
            )
            .catch(() => { });
    }, []);

    const categoryOptions = useMemo(
        () => [
            { value: "", label: "All Categories" },
            ...categoryNames.map((c) => ({ value: c, label: c })),
        ],
        [categoryNames]
    );

    // Enriched & sorted list (all products)
    const allEnriched = useMemo(() => enrichProducts(products), [products]);

    // Filtered list
    const filtered: ExpiryProduct[] = useMemo(() => {
        let list = allEnriched;

        // Range filter
        if (range !== "all") {
            const maxDays = Number(range);
            list = list.filter((p) => p.daysLeft <= maxDays);
        }

        // Category
        if (category) {
            list = list.filter((p) => p.category === category);
        }

        // In stock
        if (inStockOnly) {
            list = list.filter((p) => p.quantity > 0);
        }

        // Search
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q)
            );
        }

        return list;
    }, [allEnriched, range, category, inStockOnly, search]);

    // CSV export
    const handleExport = () => {
        const headers = [
            "name",
            "category",
            "quantity",
            "price",
            "expiry",
            "daysLeft",
            "status",
        ];
        const rows = filtered.map((p) => ({
            name: p.name,
            category: p.category,
            quantity: p.quantity,
            price: p.price,
            expiry: p.expiry,
            daysLeft: p.daysLeft,
            status: p.status,
        }));
        exportToCsv("expiry-radar.csv", rows, headers);
    };

    return (
        <div className="space-y-6">
            {/* KPI row */}
            <ExpiryRadarKpis items={allEnriched} />

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center gap-3">
                {/* Range tabs */}
                <Tabs options={rangeTabs} value={range} onChange={setRange} />

                {/* Category filter */}
                <Select
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    options={categoryOptions}
                    placeholder="All Categories"
                />

                {/* Search */}
                <div className="flex-1 min-w-[180px]">
                    <Input
                        placeholder="Search product…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        leftIcon={<Search className="w-4 h-4" />}
                    />
                </div>

                {/* In-stock toggle */}
                <Checkbox
                    label="In stock only"
                    name="inStock"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                />

                {/* Export */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    leftIcon={<Download className="w-4 h-4" />}
                >
                    Export CSV
                </Button>
            </div>

            {/* Radar chart */}
            <div className="bg-white rounded-xl border border-[#EAECF0] p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Expiry Radar
                </h2>
                <ExpiryRadarChart
                    items={allEnriched}
                    maxDays={range === "all" ? 365 : Number(range)}
                />
            </div>

            {/* Urgent list table */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Expiry List{" "}
                    <span className="text-sm font-normal text-gray-400">
                        ({filtered.length})
                    </span>
                </h2>
                <ExpiryRadarList items={filtered} />
            </div>
        </div>
    );
}
