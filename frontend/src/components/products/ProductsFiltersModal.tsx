// components/products/ProductsFiltersModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Input from "@/components/ui/Input";

export interface ProductFilters {
    categories: string[];
    expiryQuick: "7" | "30" | "90" | null;
    expiryFrom: string;
    expiryTo: string;
    quantityMin: string;
    quantityMax: string;
    priceMin: string;
    priceMax: string;
}

export const emptyFilters: ProductFilters = {
    categories: [],
    expiryQuick: null,
    expiryFrom: "",
    expiryTo: "",
    quantityMin: "",
    quantityMax: "",
    priceMin: "",
    priceMax: "",
};

export function countActiveFilters(f: ProductFilters): number {
    let count = 0;
    if (f.categories.length > 0) count++;
    if (f.expiryQuick || f.expiryFrom || f.expiryTo) count++;
    if (f.quantityMin || f.quantityMax) count++;
    if (f.priceMin || f.priceMax) count++;
    return count;
}

interface ProductsFiltersModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: ProductFilters;
    onApply: (filters: ProductFilters) => void;
    availableCategories: string[];
}

export default function ProductsFiltersModal({
    isOpen,
    onClose,
    filters,
    onApply,
    availableCategories,
}: ProductsFiltersModalProps) {
    const [local, setLocal] = useState<ProductFilters>(filters);

    useEffect(() => {
        setLocal(filters);
    }, [filters, isOpen]);

    const toggleCategory = (cat: string) => {
        setLocal((prev) => ({
            ...prev,
            categories: prev.categories.includes(cat)
                ? prev.categories.filter((c) => c !== cat)
                : [...prev.categories, cat],
        }));
    };

    const setExpiryQuick = (val: "7" | "30" | "90") => {
        setLocal((prev) => ({
            ...prev,
            expiryQuick: prev.expiryQuick === val ? null : val,
            expiryFrom: "",
            expiryTo: "",
        }));
    };

    const handleApply = () => {
        onApply(local);
        onClose();
    };

    const handleClear = () => {
        setLocal(emptyFilters);
        onApply(emptyFilters);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAECF0]">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Categories */}
                <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Category</h3>
                    <div className="space-y-2">
                        {availableCategories.map((cat) => (
                            <Checkbox
                                key={cat}
                                name={`cat-${cat}`}
                                label={cat}
                                checked={local.categories.includes(cat)}
                                onChange={() => toggleCategory(cat)}
                            />
                        ))}
                    </div>
                </div>

                {/* Expiry */}
                <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Expiry</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {(["7", "30", "90"] as const).map((d) => (
                            <button
                                key={d}
                                onClick={() => setExpiryQuick(d)}
                                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${local.expiryQuick === d
                                        ? "border-[#6941C6] bg-[#F9F5FF] text-[#6941C6] font-medium"
                                        : "border-[#D0D5DD] text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                Next {d} days
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="From"
                            type="date"
                            value={local.expiryFrom}
                            onChange={(e) =>
                                setLocal((prev) => ({
                                    ...prev,
                                    expiryFrom: e.target.value,
                                    expiryQuick: null,
                                }))
                            }
                        />
                        <Input
                            label="To"
                            type="date"
                            value={local.expiryTo}
                            onChange={(e) =>
                                setLocal((prev) => ({
                                    ...prev,
                                    expiryTo: e.target.value,
                                    expiryQuick: null,
                                }))
                            }
                        />
                    </div>
                </div>

                {/* Quantity */}
                <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Min"
                            type="number"
                            placeholder="0"
                            value={local.quantityMin}
                            onChange={(e) =>
                                setLocal((prev) => ({ ...prev, quantityMin: e.target.value }))
                            }
                        />
                        <Input
                            label="Max"
                            type="number"
                            placeholder="Any"
                            value={local.quantityMax}
                            onChange={(e) =>
                                setLocal((prev) => ({ ...prev, quantityMax: e.target.value }))
                            }
                        />
                    </div>
                </div>

                {/* Price */}
                <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Price ($)</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Min"
                            type="number"
                            placeholder="0"
                            value={local.priceMin}
                            onChange={(e) =>
                                setLocal((prev) => ({ ...prev, priceMin: e.target.value }))
                            }
                        />
                        <Input
                            label="Max"
                            type="number"
                            placeholder="Any"
                            value={local.priceMax}
                            onChange={(e) =>
                                setLocal((prev) => ({ ...prev, priceMax: e.target.value }))
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-[#EAECF0]">
                <Button variant="ghost" onClick={handleClear}>
                    Clear All
                </Button>
                <Button variant="primary" onClick={handleApply}>
                    Apply Filters
                </Button>
            </div>
        </Modal>
    );
}
