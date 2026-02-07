const API_BASE = "/api";

interface ApiResponse<T = Record<string, unknown>> {
    ok: boolean;
    status: number;
    data: T;
}

export async function apiPost<T = Record<string, unknown>>(
    path: string,
    body: Record<string, unknown>,
    token?: string | null
): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    });

    let data: T;
    try {
        data = await res.json();
    } catch {
        data = { msg: `Server error (${res.status})` } as T;
    }

    return { ok: res.ok, status: res.status, data };
}

export async function apiGet<T = Record<string, unknown>>(
    path: string,
    token?: string | null
): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {};

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
        method: "GET",
        headers,
    });

    let data: T;
    try {
        data = await res.json();
    } catch {
        data = { msg: `Server error (${res.status})` } as T;
    }

    return { ok: res.ok, status: res.status, data };
}
