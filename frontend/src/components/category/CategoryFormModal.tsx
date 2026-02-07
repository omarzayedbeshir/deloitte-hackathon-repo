// components/category/CategoryFormModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { Category, CategoryFormData } from "@/lib/types";

interface CategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CategoryFormData) => void;
    category?: Category | null;
    mode: "add" | "edit";
}

const initialFormData: CategoryFormData = {
    name: "",
    description: "",
};

interface FormErrors {
    name?: string;
    description?: string;
}

export default function CategoryFormModal({
    isOpen,
    onClose,
    onSubmit,
    category,
    mode,
}: CategoryFormModalProps) {
    const [formData, setFormData] = useState<CategoryFormData>(initialFormData);
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (category && mode === "edit") {
            setFormData({
                name: category.name,
                description: category.description,
            });
        } else {
            setFormData(initialFormData);
        }
        setErrors({});
    }, [category, mode, isOpen]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.name.trim()) newErrors.name = "Category name is required";
        if (!formData.description.trim())
            newErrors.description = "Description is required";
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
                        {mode === "add" ? "Add New Category" : "Edit Category"}
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
                            label="Category Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter category name"
                            required
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Provide the solution given or The last conversation with customer regarding the issue."
                            rows={4}
                            className="w-full rounded-lg border border-[#D0D5DD] px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6941C6] focus:border-transparent resize-none"
                            required
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#EAECF0]">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                        {mode === "add" ? "Add New Category" : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
