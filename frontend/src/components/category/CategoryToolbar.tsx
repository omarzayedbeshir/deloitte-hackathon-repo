// components/category/CategoryToolbar.tsx
"use client";

import React from "react";
import { Search, Plus, Download } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface CategoryToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    onAddCategory: () => void;
    onExport: () => void;
}

export default function CategoryToolbar({
    search,
    onSearchChange,
    onAddCategory,
    onExport,
}: CategoryToolbarProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            {/* Left side - Search */}
            <div className="w-full sm:w-80">
                <Input
                    leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                    placeholder="Search categories..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onExport}
                    leftIcon={<Download className="w-4 h-4" />}
                >
                    Export
                </Button>

                <Button
                    variant="primary"
                    size="sm"
                    onClick={onAddCategory}
                    leftIcon={<Plus className="w-4 h-4" />}
                >
                    Add New Category
                </Button>
            </div>
        </div>
    );
}
