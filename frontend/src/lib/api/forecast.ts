// lib/api/forecast.ts — Demand Forecasting API client

import { fetchJson, ApiError } from "./http";
import type { ForecastParams, ForecastResponse } from "@/lib/types";
import {
    cacheGet,
    cacheSet,
    buildForecastCacheKey,
} from "@/lib/cache";

export class ForecastModelNotFoundError extends Error {
    constructor(skuId: string) {
        super(`No model available for SKU: ${skuId}`);
        this.name = "ForecastModelNotFoundError";
    }
}

/**
 * Call GET /predict with query params.
 * Uses TTL cache. Throws ForecastModelNotFoundError if backend
 * returns 404 or model-not-found error.
 */
export async function predictDemand(
    params: ForecastParams
): Promise<ForecastResponse> {
    const cacheKey = buildForecastCacheKey(
        params.sku_id,
        params.date,
        params.temp,
        params.rain,
        params.holiday
    );

    const cached = cacheGet<ForecastResponse>(cacheKey);
    if (cached !== undefined) return cached;

    try {
        const qs = new URLSearchParams({
            sku_id: params.sku_id,
            date: params.date,
            temp: String(params.temp),
            rain: String(params.rain),
            holiday: String(params.holiday),
        }).toString();

        const result = await fetchJson<ForecastResponse>(`/predict?${qs}`);
        cacheSet(cacheKey, result);
        return result;
    } catch (err) {
        if (err instanceof ApiError && (err.status === 404 || err.status === 400)) {
            throw new ForecastModelNotFoundError(params.sku_id);
        }
        throw err;
    }
}

/**
 * Run predictions for multiple SKUs with limited concurrency.
 */
export async function predictBatch(
    paramsList: ForecastParams[],
    concurrency = 3
): Promise<{ skuId: string; result?: ForecastResponse; error?: string }[]> {
    const results: { skuId: string; result?: ForecastResponse; error?: string }[] = [];
    const queue = [...paramsList];

    async function worker() {
        while (queue.length > 0) {
            const params = queue.shift()!;
            try {
                const result = await predictDemand(params);
                results.push({ skuId: params.sku_id, result });
            } catch (err) {
                results.push({
                    skuId: params.sku_id,
                    error:
                        err instanceof ForecastModelNotFoundError
                            ? "No model available"
                            : err instanceof Error
                                ? err.message
                                : "Unknown error",
                });
            }
        }
    }

    const workers = Array.from({ length: Math.min(concurrency, paramsList.length) }, () =>
        worker()
    );
    await Promise.all(workers);
    return results;
}

export { ApiError };
