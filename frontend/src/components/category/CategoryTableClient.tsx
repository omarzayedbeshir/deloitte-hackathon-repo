// components/category/CategoryTableClient.tsx
"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import type { Category, CategoryFormData, CategoryKpi } from "@/lib/types";
import { exportToCsv } from "@/lib/csv";
import { useProducts } from "@/lib/ProductsContext";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/Toast";
import {
    fetchCategories as fetchCategoriesApi,
    createCategory as createCategoryApi,
    updateCategory as updateCategoryApi,
    deleteCategoryApi,
} from "@/lib/api/endpoints";
import StatCard from "@/components/ui/StatCard";
import CategoryToolbar from "./CategoryToolbar";
import CategoryTable from "./CategoryTable";
import CategoryFormModal from "./CategoryFormModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import CategoryProductsModal from "./CategoryProductsModal";

interface CategoryTableClientProps {
    kpis: CategoryKpi[];
}

const PAGE_SIZE = 10;

export default function CategoryTableClient({
    kpis: kpisProp,
}: CategoryTableClientProps) {
    const { token } = useAuth();
    const { showToast } = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Modal states
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [formMode, setFormMode] = useState<"add" | "edit">("add");
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(
        null
    );
    const [viewCategory, setViewCategory] = useState<Category | null>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);

    // Shared products store (for the view-products-in-category modal)
    const { products: allProducts } = useProducts();

    // Fetch categories from API
    const refreshCategories = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchCategoriesApi(token, true);
            setCategories(data);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        refreshCategories();
    }, [refreshCategories]);

    // Compute dynamic KPIs
    const computedKpis = useMemo<CategoryKpi[]>(() => {
        const active = categories.filter((c) => c.status === "active").length;
        const inactive = categories.filter((c) => c.status === "inactive").length;
        const deleted = categories.filter((c) => c.status === "deleted").length;
        return kpisProp.map((kpi) => {
            if (kpi.key === "active") return { ...kpi, value: active };
            if (kpi.key === "inactive") return { ...kpi, value: inactive };
            if (kpi.key === "deleted") return { ...kpi, value: deleted };
            return kpi;
        });
    }, [categories, kpisProp]);

    // Filter only active categories for the table
    const activeCategories = useMemo(
        () => categories.filter((c) => c.status === "active"),
        [categories]
    );

    // Search
    const filteredCategories = useMemo(() => {
        if (!search.trim()) return activeCategories;
        const q = search.toLowerCase();
        return activeCategories.filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                c.description.toLowerCase().includes(q)
        );
    }, [activeCategories, search]);

    // Pagination
    const totalPages = Math.max(
        1,
        Math.ceil(filteredCategories.length / PAGE_SIZE)
    );
    const paginatedCategories = useMemo(
        () =>
            filteredCategories.slice(
                (currentPage - 1) * PAGE_SIZE,
                currentPage * PAGE_SIZE
            ),
        [filteredCategories, currentPage]
    );

    const handleSearch = useCallback((value: string) => {
        setSearch(value);
        setCurrentPage(1);
    }, []);

    // Selection
    const handleSelectAll = useCallback(
        (checked: boolean) => {
            setSelectedIds(checked ? paginatedCategories.map((c) => c.id) : []);
        },
        [paginatedCategories]
    );

    const handleSelectOne = useCallback((id: string, checked: boolean) => {
        setSelectedIds((prev) =>
            checked ? [...prev, id] : prev.filter((i) => i !== id)
        );
    }, []);

    // CRUD
    const handleAddCategory = useCallback(() => {
        setEditingCategory(null);
        setFormMode("add");
        setFormModalOpen(true);
    }, []);

    const handleEditCategory = useCallback((cat: Category) => {
        setEditingCategory(cat);
        setFormMode("edit");
        setFormModalOpen(true);
    }, []);

    const handleViewCategory = useCallback((cat: Category) => {
        setViewCategory(cat);
        setViewModalOpen(true);
    }, []);

    const handleFormSubmit = useCallback(
        async (data: CategoryFormData) => {
            try {
                if (formMode === "add") {
                    if (!token) throw new Error("Not authenticated");
                    await createCategoryApi(data, token);
                    showToast("Category created");
                } else if (editingCategory) {
                    if (!token) throw new Error("Not authenticated");
                    await updateCategoryApi(editingCategory.id, data, token);
                    showToast("Category updated");
                }
                await refreshCategories();
                setFormModalOpen(false);
            } catch (err: unknown) {
                const msg =
                    err instanceof Error ? err.message : "Operation failed";
                showToast(msg, "error");
            }
        },
        [formMode, editingCategory, token, showToast, refreshCategories]
    );

    const handleDeleteClick = useCallback((cat: Category) => {
        setDeletingCategory(cat);
        setDeleteModalOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (deletingCategory && token) {
            try {
                await deleteCategoryApi(deletingCategory.id, token);
                await refreshCategories();
                setSelectedIds((prev) =>
                    prev.filter((id) => id !== deletingCategory.id)
                );
                showToast("Category deleted");
            } catch (err: unknown) {
                const msg =
                    err instanceof Error ? err.message : "Delete failed";
                showToast(msg, "error");
            }
        }
        setDeleteModalOpen(false);
        setDeletingCategory(null);
    }, [deletingCategory, token, showToast, refreshCategories]);

    // Export
    const handleExport = useCallback(() => {
        const rows = filteredCategories.map((c) => ({
            name: c.name,
            description: c.description,
            status: c.status,
        }));
        exportToCsv("categories.csv", rows, [
            "name",
            "description",
            "status",
        ]);
    }, [filteredCategories]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-[#6941C6] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div>
            {/* KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {computedKpis.map((kpi, index) => (
                    <StatCard
                        key={kpi.key}
                        title={kpi.label}
                        value={kpi.value}
                        highlighted={index === 0}
                    />
                ))}
            </div>

            {/* Section title */}
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Active Categories
            </h2>

            <CategoryToolbar
                search={search}
                onSearchChange={handleSearch}
                onAddCategory={handleAddCategory}
                onExport={handleExport}
            />

            <CategoryTable
                categories={paginatedCategories}
                selectedIds={selectedIds}
                onSelectAll={handleSelectAll}
                onSelectOne={handleSelectOne}
                onEdit={handleEditCategory}
                onDelete={handleDeleteClick}
                onView={handleViewCategory}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                pageSize={PAGE_SIZE}
                totalItems={filteredCategories.length}
            />

            {/* Modals */}
            <CategoryFormModal
                isOpen={formModalOpen}
                onClose={() => setFormModalOpen(false)}
                onSubmit={handleFormSubmit}
                category={editingCategory}
                mode={formMode}
            />

            <DeleteCategoryModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setDeletingCategory(null);
                }}
                onConfirm={handleDeleteConfirm}
                category={deletingCategory}
            />

            <CategoryProductsModal
                open={viewModalOpen}
                onClose={() => {
                    setViewModalOpen(false);
                    setViewCategory(null);
                }}
                categoryName={viewCategory?.name ?? ""}
                products={allProducts}
            />
        </div>
    );
}
