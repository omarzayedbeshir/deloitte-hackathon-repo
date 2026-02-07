// components/category/CategoryTable.tsx
"use client";

import React from "react";
import { Pencil, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import Checkbox from "@/components/ui/Checkbox";
import IconButton from "@/components/ui/IconButton";
import type { Category } from "@/lib/types";

interface CategoryTableProps {
    categories: Category[];
    selectedIds: string[];
    onSelectAll: (checked: boolean) => void;
    onSelectOne: (id: string, checked: boolean) => void;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    onView: (category: Category) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSize: number;
    totalItems: number;
}

function truncate(str: string, len: number): string {
    return str.length > len ? str.slice(0, len) + "…" : str;
}

export default function CategoryTable({
    categories,
    selectedIds,
    onSelectAll,
    onSelectOne,
    onEdit,
    onDelete,
    onView,
    currentPage,
    totalPages,
    onPageChange,
}: CategoryTableProps) {
    const allSelected =
        categories.length > 0 &&
        categories.every((c) => selectedIds.includes(c.id));

    return (
        <div className="bg-white border border-[#EAECF0] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-[#EAECF0]">
                            <th className="w-12 px-4 py-3 text-left">
                                <Checkbox
                                    name="select-all-cat"
                                    checked={allSelected}
                                    onChange={(e) => onSelectAll(e.target.checked)}
                                    aria-label="Select all"
                                />
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Products
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAECF0]">
                        {categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3">
                                    <Checkbox
                                        name={`select-cat-${cat.id}`}
                                        checked={selectedIds.includes(cat.id)}
                                        onChange={(e) => onSelectOne(cat.id, e.target.checked)}
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <span className="font-medium text-gray-900 text-sm">
                                        {cat.name}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500 max-w-[220px]">
                                    {truncate(cat.description, 60)}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center -space-x-2">
                                        {/* Placeholder avatar circles */}
                                        {[0, 1, 2].map((i) => (
                                            <div
                                                key={i}
                                                className="w-7 h-7 rounded-full border-2 border-white bg-gradient-to-br from-purple-300 to-purple-500"
                                            />
                                        ))}
                                        {cat.productsExtraCount && cat.productsExtraCount > 0 && (
                                            <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-600">
                                                +{cat.productsExtraCount}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-1">
                                        <IconButton aria-label="View" onClick={() => onView(cat)}>
                                            <Eye className="w-4 h-4 text-gray-500" />
                                        </IconButton>
                                        <IconButton aria-label="Edit" onClick={() => onEdit(cat)}>
                                            <Pencil className="w-4 h-4 text-[#6941C6]" />
                                        </IconButton>
                                        <IconButton
                                            aria-label="Delete"
                                            onClick={() => onDelete(cat)}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </IconButton>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-12 text-center text-sm text-gray-400"
                                >
                                    No categories found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#EAECF0]">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#D0D5DD] text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </button>

                <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => {
                            if (totalPages <= 7) return true;
                            if (p <= 3) return true;
                            if (p >= totalPages - 1) return true;
                            if (Math.abs(p - currentPage) <= 1) return true;
                            return false;
                        })
                        .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
                            if (idx > 0 && p - (arr[idx - 1] as number) > 1)
                                acc.push("ellipsis");
                            acc.push(p);
                            return acc;
                        }, [])
                        .map((item, idx) =>
                            item === "ellipsis" ? (
                                <span key={`e-${idx}`} className="px-2 text-sm text-gray-400">
                                    …
                                </span>
                            ) : (
                                <button
                                    key={item}
                                    onClick={() => onPageChange(item as number)}
                                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${currentPage === item
                                            ? "bg-[#6941C6] text-white"
                                            : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    {item}
                                </button>
                            )
                        )}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#D0D5DD] text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
