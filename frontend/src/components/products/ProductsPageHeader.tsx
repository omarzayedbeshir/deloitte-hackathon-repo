// components/products/ProductsPageHeader.tsx
"use client";

import React from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import Link from "next/link";
import Tabs from "@/components/ui/Tabs";
import Button from "@/components/ui/Button";

interface ProductsPageHeaderProps {
  title?: string;
  backHref?: string;
  selectedTab: string;
  onTabChange: (value: string) => void;
}

const tabOptions = [
  { value: "today", label: "Today" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export default function ProductsPageHeader({
  title = "Products",
  backHref = "/overview",
  selectedTab,
  onTabChange,
}: ProductsPageHeaderProps) {
  return (
    <div className="mb-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>

        <div className="flex items-center gap-4">
          <Tabs options={tabOptions} value={selectedTab} onChange={onTabChange} />
          <Button variant="outline" size="sm">
            <span>Select Dates</span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
