// lib/skuMap.ts — Stable client-side SKU ID generation from product names

const LS_KEY = "sku_map";

function loadMap(): Record<string, string> {
    if (typeof window === "undefined") return {};
    try {
        const raw = localStorage.getItem(LS_KEY);
        return raw ? (JSON.parse(raw) as Record<string, string>) : {};
    } catch {
        return {};
    }
}

function saveMap(map: Record<string, string>) {
    if (typeof window === "undefined") return;
    localStorage.setItem(LS_KEY, JSON.stringify(map));
}

/** Deterministic slug from product name: lowercase, replace non-alphanum with '-', trim dashes */
function slugify(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/** Simple djb2 hash to int, then to short hex string */
function hashStr(str: string): string {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
    }
    return hash.toString(16).slice(0, 6);
}

/**
 * Get or generate a stable skuId for a product.
 * If product already has a skuId field, use it.
 * Otherwise, generate from slug + hash and persist to localStorage.
 */
export function getSkuId(productId: string, productName: string, existingSkuId?: string): string {
    if (existingSkuId) return existingSkuId;

    const map = loadMap();
    if (map[productId]) return map[productId];

    const sku = `${slugify(productName)}-${hashStr(productName)}`;
    map[productId] = sku;
    saveMap(map);
    return sku;
}
