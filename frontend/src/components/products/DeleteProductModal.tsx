// components/products/DeleteProductModal.tsx
"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { Product } from "@/lib/types";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: Product | null;
}

export default function DeleteProductModal({
  isOpen,
  onClose,
  onConfirm,
  product,
}: DeleteProductModalProps) {
  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="p-6">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Product
          </h3>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete{" "}
            <span className="font-medium text-gray-700">{product.name}</span>?
            This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={onClose} className="min-w-[100px]">
            No, Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            className="min-w-[100px] bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            Yes, Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
