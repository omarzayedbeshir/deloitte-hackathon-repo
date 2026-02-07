// components/transactions/TransactionsToolbar.tsx
"use client";

import React from "react";
import Button from "@/components/ui/Button";

interface TransactionsToolbarProps {
    onAddTransaction: () => void;
    selectedCount: number;
    onDeleteSelected: () => void;
}

export default function TransactionsToolbar({
    onAddTransaction,
    selectedCount,
    onDeleteSelected,
}: TransactionsToolbarProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">
                    Transactions
                </h2>
                {selectedCount > 0 && (
                    <p className="text-sm text-gray-500">
                        {selectedCount} transaction(s) selected
                    </p>
                )}
            </div>
            <div className="flex gap-3">
                {selectedCount > 0 && (
                    <Button
                        variant="secondary"
                        onClick={onDeleteSelected}
                        className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                    >
                        Delete Selected
                    </Button>
                )}
                <Button onClick={onAddTransaction}>
                    + New Transaction
                </Button>
            </div>
        </div>
    );
}
