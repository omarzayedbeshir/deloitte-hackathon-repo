// app/(dashboard)/category/page.tsx
import type { Metadata } from "next";
import CategoryTableClient from "@/components/category/CategoryTableClient";
import { categoryKpis } from "@/lib/categoriesMock";

export const metadata: Metadata = {
    title: "Categories - AMO Dashboard",
    description: "Manage your product categories",
};

export default function CategoryPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Category</h1>
            </div>

            <CategoryTableClient
                kpis={categoryKpis}
            />
        </div>
    );
}
