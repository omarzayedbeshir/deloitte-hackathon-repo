import type { Metadata } from "next";
import ProductsTableClient from "@/components/products/ProductsTableClient";
import { productKpis } from "@/lib/productsMock";

export const metadata: Metadata = {
    title: "Products - AMO Dashboard",
    description: "Manage your products inventory",
};

export default function ProductsPage() {
    return (
        <div>
            <ProductsTableClient
                kpis={productKpis}
            />
        </div>
    );
}
