// components/category/CategoryProductsModal.tsx
"use client";

import React, { useState, useMemo } from "react";
import { X, Search, Package } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import type { Product } from "@/lib/types";

interface CategoryProductsModalProps {
    open: boolean;
    onClose: () => void;
    categoryName: string;
    products: Product[];
}

function formatDate(iso: string): string {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export default function CategoryProductsModal({
    open,
    onClose,
    categoryName,
    products,
}: CategoryProductsModalProps) {
    const [search, setSearch] = useState("");

    // Filter products by category name, then by search
    const filtered = useMemo(() => {
        const inCategory = products.filter(
            (p) => p.category.toLowerCase() === categoryName.toLowerCase()
        );
        if (!search.trim()) return inCategory;
        const q = search.toLowerCase();
        return inCategory.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.price.toString().includes(q)
        );
    }, [products, categoryName, search]);

    // Reset search when modal opens
    React.useEffect(() => {
        if (open) setSearch("");
    }, [open]);

    return (
        <Modal isOpen={open} onClose={onClose} maxWidth="max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAECF0]">
                <h2 className="text-lg font-semibold text-gray-900">
                    Products in {categoryName}
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* Search */}
            <div className="px-6 pt-4">
                <Input
                    leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                    placeholder="Search products…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Product list */}
            <div className="p-6 max-h-[50vh] overflow-y-auto">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <Package className="w-10 h-10 mb-3" />
                        <p className="text-sm">No products in this category.</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#EAECF0]">
                                <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product Name
                                </th>
                                <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity
                                </th>
                                <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Expiry
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EAECF0]">
                            {filtered.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 text-sm font-medium text-gray-900">
                                        {p.name}
                                    </td>
                                    <td className="py-3 text-sm text-gray-600">
                                        ${p.price.toFixed(2)}
                                    </td>
                                    <td className="py-3 text-sm text-gray-600">{p.quantity}</td>
                                    <td className="py-3 text-sm text-gray-600">
                                        {formatDate(p.expiry)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Modal>
    );
}
