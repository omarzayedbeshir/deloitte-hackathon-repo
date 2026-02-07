// components/products/ProductsToolbar.tsx
"use client";

import React from "react";
import { Search, SlidersHorizontal, Plus, Download } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface ProductsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeFilterCount: number;
  onOpenFilters: () => void;
  onAddProduct: () => void;
  onExport: () => void;
}

export default function ProductsToolbar({
  search,
  onSearchChange,
  activeFilterCount,
  onOpenFilters,
  onAddProduct,
  onExport,
}: ProductsToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
      {/* Left side - Search */}
      <div className="w-full sm:w-80">
        <Input
          leftIcon={<Search className="w-4 h-4 text-gray-400" />}
          placeholder="Search products..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenFilters}
          leftIcon={<SlidersHorizontal className="w-4 h-4" />}
        >
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#6941C6] text-white text-[10px] font-semibold">
              {activeFilterCount}
            </span>
          )}
        </Button>

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
          onClick={onAddProduct}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Product
        </Button>
      </div>
    </div>
  );
}
