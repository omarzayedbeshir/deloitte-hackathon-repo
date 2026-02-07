// lib/storage/productsCache.ts

import type { Product } from "@/lib/types";

const CACHE_KEY = "products_cache";

/** Load products list from localStorage. Returns null if nothing cached. */
export function loadProductsCache(): Product[] | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed as Product[];
        }
        return null;
    } catch {
        return null;
    }
}

/** Persist the products list to localStorage. */
export function saveProductsCache(products: Product[]): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(products));
    } catch {
        // storage full – silently ignore
    }
}
