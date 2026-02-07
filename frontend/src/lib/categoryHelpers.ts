// lib/categoryHelpers.ts

import type { Category } from "./types";

/**
 * Returns a sorted list of active category names.
 * Falls back to all categories if none are active.
 */
export function getActiveCategoryNames(categories: Category[]): string[] {
    const active = categories.filter((c) => c.status === "active");
    const source = active.length > 0 ? active : categories;
    return source.map((c) => c.name).sort();
}
