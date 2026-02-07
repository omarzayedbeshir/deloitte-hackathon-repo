// components/products/ProductsTable.tsx
"use client";

import React from "react";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Checkbox from "@/components/ui/Checkbox";
import IconButton from "@/components/ui/IconButton";
import type { Product } from "@/lib/types";

interface ProductsTableProps {
  products: Product[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalItems: number;
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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProductsTable({
  products,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
}: ProductsTableProps) {
  const allSelected =
    products.length > 0 && products.every((p) => selectedIds.includes(p.id));

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="bg-white border border-[#EAECF0] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-[#EAECF0]">
              <th className="w-12 px-4 py-3 text-left">
                <Checkbox
                  name="select-all"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  aria-label="Select all"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expiry
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAECF0]">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <Checkbox
                    name={`select-${product.id}`}
                    checked={selectedIds.includes(product.id)}
                    onChange={(e) => onSelectOne(product.id, e.target.checked)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                      {getInitials(product.name)}
                    </div>
                    <span className="font-medium text-gray-900 text-sm">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {product.category}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {product.quantity}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatDate(product.expiry)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <IconButton aria-label="Edit" onClick={() => onEdit(product)}>
                      <Pencil className="w-4 h-4 text-[#6941C6]" />
                    </IconButton>
                    <IconButton aria-label="Delete" onClick={() => onDelete(product)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">
                  No products found.
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
              if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("ellipsis");
              acc.push(p);
              return acc;
            }, [])
            .map((item, idx) =>
              item === "ellipsis" ? (
                <span key={`e-${idx}`} className="px-2 text-sm text-gray-400">…</span>
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
