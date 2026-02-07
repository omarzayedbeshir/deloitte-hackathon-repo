// components/transactions/TransactionsTable.tsx
"use client";

import React from "react";
import { Transaction } from "@/lib/types";
import Checkbox from "@/components/ui/Checkbox";

interface TransactionsTableProps {
    transactions: Transaction[];
    selectedIds: Set<string>;
    onSelectAll: (selected: boolean) => void;
    onSelectTransaction: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function TransactionsTable({
    transactions,
    selectedIds,
    onSelectAll,
    onSelectTransaction,
    onDelete,
}: TransactionsTableProps) {
    const allSelected =
        transactions.length > 0 &&
        transactions.every((t) => selectedIds.has(t.id));

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatPrice = (price: number) => {
        return `${price >= 0 ? "+" : ""}${price.toFixed(2)}`;
    };

    const getPriceColor = (price: number) => {
        return price >= 0 ? "text-green-600" : "text-red-600";
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left">
                            <Checkbox
                                name="select-all-transactions"
                                checked={allSelected}
                                onChange={(e) =>
                                    onSelectAll(e.currentTarget.checked)
                                }
                            />
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Product
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Type
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Amount
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length === 0 ? (
                        <tr>
                            <td
                                colSpan={7}
                                className="px-6 py-8 text-center text-gray-500"
                            >
                                No transactions found
                            </td>
                        </tr>
                    ) : (
                        transactions.map((transaction) => (
                            <tr
                                key={transaction.id}
                                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-3">
                                    <Checkbox
                                        name={`transaction-${transaction.id}`}
                                        checked={selectedIds.has(
                                            transaction.id
                                        )}
                                        onChange={() =>
                                            onSelectTransaction(
                                                transaction.id
                                            )
                                        }
                                    />
                                </td>
                                <td className="px-6 py-3 text-sm text-gray-700">
                                    {formatDate(
                                        transaction.time_of_transaction
                                    )}
                                </td>
                                <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                                    {transaction.product_name}
                                </td>
                                <td className="px-6 py-3 text-sm">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${transaction.transaction_type ===
                                            "sale"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-orange-100 text-orange-800"
                                            }`}
                                    >
                                        {transaction.transaction_type ===
                                            "sale"
                                            ? "Sale"
                                            : "Purchase"}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-sm text-gray-700">
                                    {transaction.product_quantity} units
                                </td>
                                <td
                                    className={`px-6 py-3 text-sm font-semibold ${getPriceColor(
                                        transaction.total_price
                                    )}`}
                                >
                                    ${formatPrice(transaction.total_price)}
                                </td>
                                <td className="px-6 py-3 text-center">
                                    <button
                                        onClick={() =>
                                            onDelete(transaction.id)
                                        }
                                        className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
