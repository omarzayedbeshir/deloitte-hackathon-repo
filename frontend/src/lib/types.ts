// lib/types.ts

export interface KpiData {
    id: string;
    title: string;
    value: string;
    deltaPercent: number;
    deltaDirection: "up" | "down";
    sparklineData: number[];
}

export interface MonthlySalesData {
    month: string;
    grossSalesRevenue: number;
    inventoryMoved: number;
    year: number;
}

export interface SankeyNode {
    name: string;
    value: number;
}

export interface SankeyLink {
    source: string;
    target: string;
    value: number;
}

export interface CategoryData {
    name: string;
    value: number;
    color: string;
}

export interface ProductData {
    name: string;
    percentage: number;
}

export interface NavItem {
    name: string;
    href: string;
    icon: string;
}

// Products Module Types
export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    expiry: string; // ISO date string like "2026-12-31"
    description?: string;
}

export interface ProductFormData {
    name: string;
    category: string;
    price: number;
    quantity: number;
    expiry: string;
    description?: string;
}

export interface ProductKpi {
    key: string;
    label: string;
    value: number;
}

// Category Module Types
export interface Category {
    id: string;
    name: string;
    description: string;
    productsAvatars?: string[];
    productsExtraCount?: number;
    status: "active" | "inactive" | "deleted";
}

export interface CategoryFormData {
    name: string;
    description: string;
}

export interface CategoryKpi {
    key: string;
    label: string;
    value: number;
}
// Transactions Module Types
export interface Transaction {
    id: string;
    product_id: string;
    product_name: string;
    transaction_type: "sale" | "purchase";
    product_quantity: number;
    total_price: number;
    time_of_transaction: string; // ISO date string
}

export interface TransactionFormData {
    product_name: string;
    product_quantity: number;
    transaction_type: "sale" | "purchase";
}

export interface TransactionKpi {
    key: string;
    label: string;
    value: number | string;
}