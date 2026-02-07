// lib/api/endpoints.ts

import { fetchJson, ApiError } from "./http";
import type {
    Product,
    ProductFormData,
    Category,
    CategoryFormData,
    Transaction,
    TransactionFormData,
} from "@/lib/types";

// ----------------------------------------------------------------
// AUTH
// ----------------------------------------------------------------
export async function loginUser(
    username: string,
    password: string
): Promise<{ access_token: string; username: string }> {
    return fetchJson<{ access_token: string; username: string }>("/auth/login", {
        method: "POST",
        body: { username, password },
    });
}

export async function registerUser(
    username: string,
    password: string
): Promise<{ message: string }> {
    return fetchJson<{ message: string }>("/auth/register", {
        method: "POST",
        body: { username, password },
    });
}

// ----------------------------------------------------------------
// CATEGORIES
// ----------------------------------------------------------------
export async function fetchCategories(
    token?: string | null,
    includeDeleted = false
): Promise<Category[]> {
    const qs = includeDeleted ? "?includeDeleted=true" : "";
    return fetchJson<Category[]>(`/categories${qs}`, { token });
}

export async function createCategory(
    data: CategoryFormData,
    token: string
): Promise<Category> {
    return fetchJson<Category>("/categories", {
        method: "POST",
        body: { name: data.name, description: data.description },
        token,
    });
}

export async function updateCategory(
    id: string,
    data: Partial<CategoryFormData & { status: string }>,
    token: string
): Promise<Category> {
    return fetchJson<Category>(`/categories/${id}`, {
        method: "PUT",
        body: data,
        token,
    });
}

export async function deleteCategoryApi(
    id: string,
    token: string
): Promise<{ message: string }> {
    return fetchJson<{ message: string }>(`/categories/${id}`, {
        method: "DELETE",
        token,
    });
}

// ----------------------------------------------------------------
// INVENTORY
// ----------------------------------------------------------------
export interface InventoryFilters {
    search?: string;
    category?: string;
    minQty?: string;
    maxQty?: string;
    minPrice?: string;
    maxPrice?: string;
    expiryFrom?: string;
    expiryTo?: string;
    includeDeleted?: boolean;
}

export async function fetchInventory(
    filters?: InventoryFilters,
    token?: string | null
): Promise<Product[]> {
    const params = new URLSearchParams();
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== "" && value !== false) {
                params.set(key, String(value));
            }
        });
    }
    const qs = params.toString();
    const path = qs ? `/inventory?${qs}` : "/inventory";
    return fetchJson<Product[]>(path, { token });
}

export async function createInventoryItem(
    data: ProductFormData,
    token: string
): Promise<{ message: string; item: Product }> {
    return fetchJson<{ message: string; item: Product }>("/inventory", {
        method: "POST",
        body: {
            name: data.name,
            quantity: data.quantity,
            category: data.category,
            price: data.price,
            expiry: data.expiry || undefined,
            description: data.description || "",
        },
        token,
    });
}

export async function updateInventoryItem(
    id: string,
    data: Partial<ProductFormData>,
    token: string
): Promise<{ message: string; item: Product }> {
    return fetchJson<{ message: string; item: Product }>(`/inventory/${id}`, {
        method: "PUT",
        body: data,
        token,
    });
}

export async function deleteInventoryItem(
    id: string,
    token: string
): Promise<{ message: string }> {
    return fetchJson<{ message: string }>(`/inventory/${id}`, {
        method: "DELETE",
        token,
    });
}

// ----------------------------------------------------------------
// TRANSACTIONS
// ----------------------------------------------------------------
export async function fetchTransactions(
    token: string
): Promise<Transaction[]> {
    return fetchJson<Transaction[]>("/transactions", { token });
}

export async function createTransactionApi(
    data: TransactionFormData,
    token: string
): Promise<{ message: string; total_price: number; transaction: Transaction }> {
    return fetchJson<{
        message: string;
        total_price: number;
        transaction: Transaction;
    }>("/transactions", {
        method: "POST",
        body: {
            name: data.product_name,
            quantity: data.product_quantity,
            transaction_type: data.transaction_type,
        },
        token,
    });
}

// ----------------------------------------------------------------
// EXPIRY RADAR
// ----------------------------------------------------------------
export interface ExpiryItem {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    expiry: string | null;
    description?: string;
    status?: string;
    daysToExpiry: number;
    expiryStatus: "expired" | "expiringSoon" | "safe";
}

export interface ExpiryRadarResponse {
    expired: ExpiryItem[];
    expiringSoon: ExpiryItem[];
    safe: ExpiryItem[];
    counts: {
        total: number;
        expired: number;
        expiringSoon: number;
        safe: number;
    };
}

export async function fetchExpiryRadar(
    days?: number,
    category?: string
): Promise<ExpiryRadarResponse> {
    const params = new URLSearchParams();
    if (days !== undefined) params.set("days", String(days));
    if (category) params.set("category", category);
    const qs = params.toString();
    const path = qs ? `/expiry-radar?${qs}` : "/expiry-radar";
    return fetchJson<ExpiryRadarResponse>(path);
}

export { ApiError };
