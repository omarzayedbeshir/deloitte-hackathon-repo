// lib/api/http.ts

export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

interface FetchJsonOptions extends Omit<RequestInit, "body"> {
    body?: unknown;
    token?: string | null;
}

/**
 * Thin wrapper around fetch that:
 * - prefixes the base URL
 * - serialises / deserialises JSON
 * - injects Authorization header when a token is supplied
 * - throws ApiError with the backend error message on non-2xx
 */
export async function fetchJson<T>(
    path: string,
    options: FetchJsonOptions = {}
): Promise<T> {
    const { body, token, headers: extraHeaders, ...rest } = options;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(extraHeaders as Record<string, string>),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${path}`, {
        ...rest,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    // Try to parse the JSON body regardless (backend always returns JSON)
    let data: T;
    try {
        data = (await res.json()) as T;
    } catch {
        throw new ApiError("Unexpected server response", res.status);
    }

    if (!res.ok) {
        const msg =
            (data as Record<string, unknown>)?.error ??
            (data as Record<string, unknown>)?.message ??
            "Request failed";
        throw new ApiError(String(msg), res.status);
    }

    return data;
}
