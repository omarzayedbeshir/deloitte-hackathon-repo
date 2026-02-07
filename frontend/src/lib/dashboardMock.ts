// lib/dashboardMock.ts

import type {
    KpiData,
    MonthlySalesData,
    CategoryData,
    ProductData,
    NavItem,
} from "./types";

export const kpis: KpiData[] = [
    {
        id: "avg-order-volume",
        title: "Average Order Volume",
        value: "$208",
        deltaPercent: 12,
        deltaDirection: "up",
        sparklineData: [30, 45, 35, 50, 40, 60, 55, 70, 65, 80, 75, 90],
    },
    {
        id: "transaction-count",
        title: "Transaction Count (Orders)",
        value: "100",
        deltaPercent: 2,
        deltaDirection: "down",
        sparklineData: [80, 75, 85, 70, 78, 72, 68, 74, 70, 65, 72, 68],
    },
    {
        id: "products-sold",
        title: "Products Sold",
        value: "270",
        deltaPercent: 2,
        deltaDirection: "down",
        sparklineData: [60, 55, 65, 58, 62, 55, 50, 58, 52, 48, 55, 50],
    },
    {
        id: "gross-profit-margin",
        title: "Gross Profit Margin",
        value: "69.10%",
        deltaPercent: 12,
        deltaDirection: "up",
        sparklineData: [40, 50, 45, 55, 50, 60, 65, 58, 70, 75, 80, 85],
    },
    {
        id: "gross-profit",
        title: "Gross Profit",
        value: "$26.4k",
        deltaPercent: 2,
        deltaDirection: "down",
        sparklineData: [70, 65, 75, 68, 72, 65, 60, 68, 62, 58, 65, 60],
    },
    {
        id: "total-net-revenue",
        title: "Total Net Revenue",
        value: "$1.8m",
        deltaPercent: 2,
        deltaDirection: "up",
        sparklineData: [30, 40, 35, 45, 50, 55, 60, 58, 65, 70, 75, 80],
    },
];

export const monthlySales: MonthlySalesData[] = [
    { month: "Jan", grossSalesRevenue: 180, inventoryMoved: 120, year: 2023 },
    { month: "Feb", grossSalesRevenue: 200, inventoryMoved: 180, year: 2023 },
    { month: "Mar", grossSalesRevenue: 220, inventoryMoved: 160, year: 2023 },
    { month: "Apr", grossSalesRevenue: 190, inventoryMoved: 140, year: 2023 },
    { month: "May", grossSalesRevenue: 240, inventoryMoved: 200, year: 2023 },
    { month: "Jun", grossSalesRevenue: 280, inventoryMoved: 220, year: 2023 },
    { month: "Jul", grossSalesRevenue: 260, inventoryMoved: 180, year: 2023 },
    { month: "Aug", grossSalesRevenue: 250, inventoryMoved: 170, year: 2023 },
    { month: "Sep", grossSalesRevenue: 230, inventoryMoved: 160, year: 2023 },
    { month: "Oct", grossSalesRevenue: 270, inventoryMoved: 200, year: 2023 },
    { month: "Nov", grossSalesRevenue: 290, inventoryMoved: 210, year: 2023 },
    { month: "Dec", grossSalesRevenue: 300, inventoryMoved: 230, year: 2023 },
    { month: "Jan", grossSalesRevenue: 280, inventoryMoved: 200, year: 2024 },
    { month: "Feb", grossSalesRevenue: 320, inventoryMoved: 240, year: 2024 },
    { month: "Mar", grossSalesRevenue: 340, inventoryMoved: 260, year: 2024 },
];

export const sankeyLeftNodes = [
    { name: "Beaf (Austin)", percentage: 59.7 },
    { name: "Beaf (Crosby)", percentage: 13 },
    { name: "Beaf (Malibu)", percentage: 12.7 },
    { name: "Beaf (Muscal)", percentage: 7.3 },
    { name: "Beaf (Cranbury)", percentage: 5.2 },
];

export const sankeyRightNodes = [
    { name: "Beaf (Baytown)", percentage: 13.9 },
    { name: "Beaf (Kirby)", percentage: 2.6 },
    { name: "Beaf (Kirby)", percentage: 1.8 },
    { name: "Beaf (Irving)", percentage: 1.3 },
    { name: "Beaf (Huston)", percentage: 4 },
];

export const categories: CategoryData[] = [
    { name: "E-Vapes", value: 30, color: "#6941C6" },
    { name: "Accessories", value: 25, color: "#7F56D9" },
    { name: "Disposables", value: 20, color: "#B692F6" },
    { name: "Tobacco", value: 15, color: "#D6BBFB" },
    { name: "Others", value: 10, color: "#F4EBFF" },
];

export const products: ProductData[] = [
    { name: "Stiiizy Vapes", percentage: 37 },
    { name: "Aston E-Cig", percentage: 14 },
    { name: "Retro- T Joints", percentage: 50 },
    { name: "Mikey Handles", percentage: 50 },
    { name: "Blue Ribbon", percentage: 50 },
    { name: "Fourloko", percentage: 50 },
    { name: "Blastboyz", percentage: 50 },
    { name: "Cultivator", percentage: 50 },
];

export const navItems: NavItem[] = [
    { name: "Overview", href: "/overview", icon: "overview" },
    { name: "Products", href: "/products", icon: "products" },
    { name: "Expiry Radar", href: "/expiry-radar", icon: "expiryRadar" },
    { name: "Transactions", href: "/transactions", icon: "transactions" },
    { name: "Supplier", href: "/supplier", icon: "supplier" },
    { name: "Category", href: "/category", icon: "category" },
    { name: "Warehouse", href: "/warehouse", icon: "warehouse" },
    { name: "Payment", href: "/payment", icon: "payment" },
    { name: "Roles", href: "/roles", icon: "roles" },
    { name: "Support", href: "/support", icon: "support" },
    { name: "Settings", href: "/settings", icon: "settings" },
];

export const dateRanges = ["1d", "7d", "1m", "3m", "6m", "1y", "3y", "5y"];
