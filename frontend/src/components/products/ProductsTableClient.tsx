// components/products/ProductsTableClient.tsx
"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import type { Product, ProductFormData, ProductKpi } from "@/lib/types";
import { exportToCsv } from "@/lib/csv";
import { useProducts } from "@/lib/ProductsContext";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { fetchCategories } from "@/lib/api/endpoints";
import ProductsPageHeader from "./ProductsPageHeader";
import ProductsKpiRow from "./ProductsKpiRow";
import ProductsToolbar from "./ProductsToolbar";
import ProductsTable from "./ProductsTable";
import ProductFormModal from "./ProductFormModal";
import DeleteProductModal from "./DeleteProductModal";
import ProductsFiltersModal, {
  ProductFilters,
  emptyFilters,
  countActiveFilters,
} from "./ProductsFiltersModal";

interface ProductsTableClientProps {
  kpis: ProductKpi[];
}

const PAGE_SIZE = 10;

export default function ProductsTableClient({
  kpis: kpisProp,
}: ProductsTableClientProps) {
  const { products, addProduct, editProduct, deleteProduct, deletedCount, loading } =
    useProducts();
  const { token } = useAuth();
  const { showToast } = useToast();
  const [selectedTab, setSelectedTab] = useState("monthly");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<ProductFilters>(emptyFilters);

  // Category options for the product form select – fetched from API
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  useEffect(() => {
    fetchCategories(token)
      .then((cats) =>
        setCategoryOptions(
          cats
            .filter((c) => c.status === "active")
            .map((c) => c.name)
            .sort()
        )
      )
      .catch(() => { });
  }, [token]);

  // Modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);

  // Compute dynamic KPIs
  const computedKpis = useMemo<ProductKpi[]>(() => {
    const available = products.filter((p) => p.quantity > 0).length;
    const outOfStock = products.filter((p) => p.quantity === 0).length;
    return kpisProp.map((kpi) => {
      if (kpi.key === "available") return { ...kpi, value: available };
      if (kpi.key === "outOfStock") return { ...kpi, value: outOfStock };
      if (kpi.key === "deleted") return { ...kpi, value: deletedCount };
      return kpi;
    });
  }, [products, deletedCount, kpisProp]);

  // Available categories for the filter modal (derived from product data)
  const availableCategories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return Array.from(cats).sort();
  }, [products]);

  // Filter + search
  const filteredProducts = useMemo(() => {
    let result = products;

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }

    // Expiry filter
    if (filters.expiryQuick) {
      const now = new Date();
      const days = parseInt(filters.expiryQuick);
      const cutoff = new Date(now.getTime() + days * 86400000);
      result = result.filter((p) => new Date(p.expiry) <= cutoff);
    } else {
      if (filters.expiryFrom) {
        result = result.filter((p) => p.expiry >= filters.expiryFrom);
      }
      if (filters.expiryTo) {
        result = result.filter((p) => p.expiry <= filters.expiryTo);
      }
    }

    // Quantity filter
    if (filters.quantityMin) {
      const min = parseInt(filters.quantityMin);
      result = result.filter((p) => p.quantity >= min);
    }
    if (filters.quantityMax) {
      const max = parseInt(filters.quantityMax);
      result = result.filter((p) => p.quantity <= max);
    }

    // Price filter
    if (filters.priceMin) {
      const min = parseFloat(filters.priceMin);
      result = result.filter((p) => p.price >= min);
    }
    if (filters.priceMax) {
      const max = parseFloat(filters.priceMax);
      result = result.filter((p) => p.price <= max);
    }

    return result;
  }, [products, search, filters]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const paginatedProducts = useMemo(
    () =>
      filteredProducts.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [filteredProducts, currentPage]
  );

  // Reset page when filters change
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handleApplyFilters = useCallback((f: ProductFilters) => {
    setFilters(f);
    setCurrentPage(1);
  }, []);

  // Selection
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedIds(checked ? paginatedProducts.map((p) => p.id) : []);
    },
    [paginatedProducts]
  );

  const handleSelectOne = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  }, []);

  // CRUD
  const handleAddProduct = useCallback(() => {
    setEditingProduct(null);
    setFormMode("add");
    setFormModalOpen(true);
  }, []);

  const handleEditProduct = useCallback((product: Product) => {
    setEditingProduct(product);
    setFormMode("edit");
    setFormModalOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (data: ProductFormData) => {
      try {
        if (formMode === "add") {
          await addProduct(data);
          showToast("Product added successfully");
        } else if (editingProduct) {
          await editProduct(editingProduct.id, data);
          showToast("Product updated successfully");
        }
        setFormModalOpen(false);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Operation failed";
        showToast(msg, "error");
      }
    },
    [formMode, editingProduct, addProduct, editProduct, showToast]
  );

  const handleDeleteClick = useCallback((product: Product) => {
    setDeletingProduct(product);
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (deletingProduct) {
      try {
        await deleteProduct(deletingProduct.id);
        setSelectedIds((prev) => prev.filter((id) => id !== deletingProduct.id));
        showToast("Product deleted");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Delete failed";
        showToast(msg, "error");
      }
    }
    setDeleteModalOpen(false);
    setDeletingProduct(null);
  }, [deletingProduct, deleteProduct, showToast]);

  // Export
  const handleExport = useCallback(() => {
    const rows = filteredProducts.map((p) => ({
      name: p.name,
      category: p.category,
      price: p.price,
      quantity: p.quantity,
      expiry: p.expiry,
    }));
    exportToCsv("products.csv", rows, [
      "name",
      "category",
      "price",
      "quantity",
      "expiry",
    ]);
  }, [filteredProducts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#6941C6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <ProductsPageHeader
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />

      <ProductsKpiRow kpis={computedKpis} />

      <ProductsToolbar
        search={search}
        onSearchChange={handleSearch}
        activeFilterCount={countActiveFilters(filters)}
        onOpenFilters={() => setFiltersModalOpen(true)}
        onAddProduct={handleAddProduct}
        onExport={handleExport}
      />

      <ProductsTable
        products={paginatedProducts}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        onEdit={handleEditProduct}
        onDelete={handleDeleteClick}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={PAGE_SIZE}
        totalItems={filteredProducts.length}
      />

      {/* Modals */}
      <ProductFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        product={editingProduct}
        mode={formMode}
        categoryOptions={categoryOptions}
      />

      <DeleteProductModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingProduct(null);
        }}
        onConfirm={handleDeleteConfirm}
        product={deletingProduct}
      />

      <ProductsFiltersModal
        isOpen={filtersModalOpen}
        onClose={() => setFiltersModalOpen(false)}
        filters={filters}
        onApply={handleApplyFilters}
        availableCategories={availableCategories}
      />
    </div>
  );
}
