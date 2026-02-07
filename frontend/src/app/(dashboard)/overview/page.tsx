import type { Metadata } from "next";
import { kpis } from "@/lib/dashboardMock";
import KpiCard from "@/components/dashboard/KpiCard";
import MonthlyStackedBar from "@/components/dashboard/charts/MonthlyStackedBar";
import InventorySankey from "@/components/dashboard/charts/InventorySankey";
import CategoryDonut from "@/components/dashboard/charts/CategoryDonut";
import ProductBars from "@/components/dashboard/charts/ProductBars";

export const metadata: Metadata = {
    title: "Overview - AMO Dashboard",
    description: "Dashboard overview with key metrics and analytics",
};

export default function OverviewPage() {
    return (
        <div className="space-y-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {kpis.map((kpi) => (
                    <KpiCard key={kpi.id} {...kpi} />
                ))}
            </div>

            {/* Monthly Sales Chart */}
            <MonthlyStackedBar />

            {/* Inventory Movement Sankey */}
            <InventorySankey />

            {/* Bottom Row: Donut Chart and Product Bars */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <CategoryDonut />
                <ProductBars />
            </div>
        </div>
    );
}
