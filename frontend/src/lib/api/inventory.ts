// lib/api/inventory.ts

import { fetchJson } from "./http";
import type { ProductFormData } from "@/lib/types";

/** Shape the backend expects for POST /inventory */
export interface InventoryPayload {
    name: string;
    quantity: number;
    category: string;
    price: number;
    expiry?: string;
    description?: string;
}

/** Shape the backend returns on success */
export interface InventoryResponse {
    message: string;
}

/**
 * Map our frontend form data → backend payload and call POST /inventory.
 * Requires a valid JWT token.
 */
export async function upsertInventoryItem(
    data: ProductFormData,
    token: string
): Promise<InventoryResponse> {
    const payload: InventoryPayload = {
        name: data.name,
        quantity: data.quantity,
        category: data.category,
        price: data.price,
    };

    // Only include expiry if it's a non-empty YYYY-MM-DD string
    if (data.expiry) {
        payload.expiry = data.expiry;
    }

    // UI has no description input – send empty string so field is present
    payload.description = "";

    return fetchJson<InventoryResponse>("/inventory", {
        method: "POST",
        body: payload,
        token,
    });
}
