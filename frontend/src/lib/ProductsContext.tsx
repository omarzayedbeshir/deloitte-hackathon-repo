// lib/ProductsContext.tsx
"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from "react";
import type { Product, ProductFormData } from "./types";
import { useAuth } from "./AuthContext";
import {
    fetchInventory,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
} from "./api/endpoints";

interface ProductsContextValue {
    products: Product[];
    loading: boolean;
    addProduct: (data: ProductFormData) => Promise<void>;
    editProduct: (id: string, data: ProductFormData) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    refreshProducts: () => Promise<void>;
    deletedCount: number;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
    const { token } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletedCount, setDeletedCount] = useState(0);

    const refreshProducts = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchInventory(undefined, token);
            setProducts(data);
        } catch (err) {
            console.error("Failed to fetch products:", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        refreshProducts();
    }, [refreshProducts]);

    const addProduct = useCallback(
        async (data: ProductFormData) => {
            if (!token) throw new Error("Not authenticated");
            await createInventoryItem(data, token);
            await refreshProducts();
        },
        [token, refreshProducts]
    );

    const editProduct = useCallback(
        async (id: string, data: ProductFormData) => {
            if (!token) throw new Error("Not authenticated");
            await updateInventoryItem(id, data, token);
            await refreshProducts();
        },
        [token, refreshProducts]
    );

    const deleteProduct = useCallback(
        async (id: string) => {
            if (!token) throw new Error("Not authenticated");
            await deleteInventoryItem(id, token);
            setDeletedCount((c) => c + 1);
            await refreshProducts();
        },
        [token, refreshProducts]
    );

    return (
        <ProductsContext.Provider
            value={{
                products,
                loading,
                addProduct,
                editProduct,
                deleteProduct,
                refreshProducts,
                deletedCount,
            }}
        >
            {children}
        </ProductsContext.Provider>
    );
}

export function useProducts(): ProductsContextValue {
    const ctx = useContext(ProductsContext);
    if (!ctx) {
        throw new Error("useProducts must be used within a ProductsProvider");
    }
    return ctx;
}
