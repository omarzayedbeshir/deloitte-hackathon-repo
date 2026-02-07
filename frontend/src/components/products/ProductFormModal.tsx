// components/products/ProductFormModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import type { Product, ProductFormData } from "@/lib/types";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  product?: Product | null;
  mode: "add" | "edit";
  /** Active category names to populate the select dropdown */
  categoryOptions: string[];
}

const initialFormData: ProductFormData = {
  name: "",
  category: "",
  price: 0,
  quantity: 0,
  expiry: "",
};

interface FormErrors {
  name?: string;
  category?: string;
  price?: string;
  quantity?: string;
  expiry?: string;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  mode,
  categoryOptions,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (product && mode === "edit") {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
        expiry: product.expiry,
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [product, mode, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (formData.price < 0) newErrors.price = "Price must be 0 or greater";
    if (formData.quantity < 0)
      newErrors.quantity = "Quantity must be 0 or greater";
    if (!formData.expiry) {
      newErrors.expiry = "Expiry date is required";
    } else if (isNaN(new Date(formData.expiry).getTime())) {
      newErrors.expiry = "Invalid date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAECF0]">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === "add" ? "Add New Product" : "Edit Product"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <Input
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder={
                categoryOptions.length === 0
                  ? "No categories found"
                  : "Select a category"
              }
              disabled={categoryOptions.length === 0}
              options={categoryOptions.map((c) => ({ value: c, label: c }))}
              error={errors.category}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Price ($)"
                name="price"
                type="number"
                value={formData.price.toString()}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">{errors.price}</p>
              )}
            </div>

            <div>
              <Input
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity.toString()}
                onChange={handleChange}
                placeholder="0"
                required
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
              )}
            </div>
          </div>

          <div>
            <Input
              label="Expiry Date"
              name="expiry"
              type="date"
              value={formData.expiry}
              onChange={handleChange}
              required
            />
            {errors.expiry && (
              <p className="mt-1 text-sm text-red-500">{errors.expiry}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#EAECF0]">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {mode === "add" ? "Add Product" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
