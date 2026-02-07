// lib/categoriesMock.ts

import { Category, CategoryKpi } from "./types";

export const initialCategories: Category[] = [
    {
        id: "cat-1",
        name: "Food & Beverages",
        description:
            "Provide the solution given or The last conversation with customer regarding the issue.",
        productsExtraCount: 5,
        status: "active",
    },
    {
        id: "cat-2",
        name: "E-Ciggs",
        description:
            "Provide the solution given or The last conversation with customer regarding the issue.",
        productsExtraCount: 5,
        status: "active",
    },
    {
        id: "cat-3",
        name: "FMCG",
        description:
            "Provide the solution given or The last conversation with customer regarding the issue.",
        productsExtraCount: 5,
        status: "active",
    },
    {
        id: "cat-4",
        name: "Bakery & Confectionery",
        description:
            "Provide the solution given or The last conversation with customer regarding the issue.",
        productsExtraCount: 5,
        status: "active",
    },
    {
        id: "cat-5",
        name: "Traditional Vapes",
        description:
            "All traditional vape products including mods, tanks, and coils.",
        productsExtraCount: 3,
        status: "active",
    },
    {
        id: "cat-6",
        name: "Edibles",
        description:
            "Edible products including gummies, chocolates, and beverages.",
        productsExtraCount: 7,
        status: "active",
    },
    {
        id: "cat-7",
        name: "Accessories",
        description: "Accessories such as batteries, chargers, and cases.",
        productsExtraCount: 4,
        status: "inactive",
    },
    {
        id: "cat-8",
        name: "Health & Wellness",
        description:
            "Products focused on health and wellness including supplements.",
        productsExtraCount: 2,
        status: "inactive",
    },
    {
        id: "cat-9",
        name: "Cosmetics",
        description: "Cosmetic and beauty related products.",
        productsExtraCount: 6,
        status: "deleted",
    },
    {
        id: "cat-10",
        name: "Household",
        description: "Household items and everyday essentials.",
        productsExtraCount: 8,
        status: "active",
    },
];

export const categoryKpis: CategoryKpi[] = [
    { key: "active", label: "Active Categories", value: 100 },
    { key: "inactive", label: "Inactive Categories", value: 19 },
    { key: "deleted", label: "Deleted Categories", value: 10 },
];
