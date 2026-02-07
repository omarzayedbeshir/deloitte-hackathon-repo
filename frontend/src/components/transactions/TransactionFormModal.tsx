// components/transactions/TransactionFormModal.tsx
"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import type { TransactionFormData } from "@/lib/types";

interface TransactionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: TransactionFormData) => void;
    products: Array<{ id: string; name: string; price: number }>;
}

export default function TransactionFormModal({
    isOpen,
    onClose,
    onSubmit,
    products,
}: TransactionFormModalProps) {
    const [formData, setFormData] = useState<TransactionFormData>({
        product_name: "",
        product_quantity: 1,
        transaction_type: "sale",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (
            formData.product_name &&
            formData.product_quantity > 0
        ) {
            onSubmit(formData);
            setFormData({
                product_name: "",
                product_quantity: 1,
                transaction_type: "sale",
            });
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">New Transaction</h2>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product
                    </label>
                    <Select
                        name="product"
                        value={formData.product_name}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                product_name: e.target.value,
                            })
                        }
                        options={[
                            { label: "Select a product", value: "" },
                            ...products.map((p) => ({
                                label: p.name,
                                value: p.name,
                            })),
                        ]}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transaction Type
                    </label>
                    <Select
                        name="transaction_type"
                        value={formData.transaction_type}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                transaction_type: e.target.value as
                                    | "sale"
                                    | "purchase",
                            })
                        }
                        options={[
                            { label: "Sale (decrease inventory)", value: "sale" },
                            {
                                label: "Purchase (increase inventory)",
                                value: "purchase",
                            },
                        ]}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                    </label>
                    <Input
                        type="number"
                        min="1"
                        value={formData.product_quantity}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                product_quantity: parseInt(e.target.value, 10),
                            })
                        }
                        placeholder="Enter quantity"
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button type="submit">Create Transaction</Button>
                </div>
            </form>
        </Modal>
    );
}
