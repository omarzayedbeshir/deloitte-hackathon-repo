// lib/cache.ts — TTL-based in-memory + localStorage cache for forecast predictions

const TTL_MS = 60 * 60 * 1000; // 1 hour

interface CacheEntry<T> {
    value: T;
    expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();

const LS_KEY = "forecast_cache";

function loadFromLs(): Record<string, CacheEntry<unknown>> {
    if (typeof window === "undefined") return {};
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return {};
        return JSON.parse(raw) as Record<string, CacheEntry<unknown>>;
    } catch {
        return {};
    }
}

function persistToLs(key: string, entry: CacheEntry<unknown>) {
    if (typeof window === "undefined") return;
    try {
        const all = loadFromLs();
        all[key] = entry;
        // Prune expired entries while persisting
        const now = Date.now();
        for (const k of Object.keys(all)) {
            if (all[k].expiresAt < now) delete all[k];
        }
        localStorage.setItem(LS_KEY, JSON.stringify(all));
    } catch {
        // localStorage full or unavailable, ignore
    }
}

export function cacheGet<T>(key: string): T | undefined {
    const now = Date.now();

    // 1. Check memory
    const mem = memoryCache.get(key) as CacheEntry<T> | undefined;
    if (mem && mem.expiresAt > now) return mem.value;
    if (mem) memoryCache.delete(key);

    // 2. Check localStorage
    const all = loadFromLs();
    const ls = all[key] as CacheEntry<T> | undefined;
    if (ls && ls.expiresAt > now) {
        // Promote to memory
        memoryCache.set(key, ls);
        return ls.value;
    }

    return undefined;
}

export function cacheSet<T>(key: string, value: T): void {
    const entry: CacheEntry<T> = { value, expiresAt: Date.now() + TTL_MS };
    memoryCache.set(key, entry as CacheEntry<unknown>);
    persistToLs(key, entry as CacheEntry<unknown>);
}

export function buildForecastCacheKey(
    skuId: string,
    date: string,
    temp: number,
    rain: number,
    holiday: number
): string {
    return `${skuId}|${date}|${temp}|${rain}|${holiday}`;
}
