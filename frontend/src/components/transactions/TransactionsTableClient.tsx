// components/transactions/TransactionsTableClient.tsx
"use client";

import React, { useState, useMemo } from "react";
import TransactionsToolbar from "./TransactionsToolbar";
import TransactionsKpiRow from "./TransactionsKpiRow";
import TransactionsTable from "./TransactionsTable";
import TransactionFormModal from "./TransactionFormModal";
import { useTransactions } from "@/lib/TransactionsContext";
import { useProducts } from "@/lib/ProductsContext";
import { useToast } from "@/components/ui/Toast";
import type { TransactionKpi, TransactionFormData } from "@/lib/types";

export default function TransactionsTableClient() {
    const {
        transactions,
        addTransaction,
        deleteTransaction,
        loading,
        getTotalRevenue,
        getTotalExpenses,
        getNetProfit,
    } = useTransactions();
    const { products } = useProducts();
    const { showToast } = useToast();
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Compute live KPIs from actual data
    const computedKpis = useMemo<TransactionKpi[]>(() => {
        const revenue = getTotalRevenue();
        const expenses = getTotalExpenses();
        const net = getNetProfit();
        return [
            {
                key: "total-revenue",
                label: "Total Revenue",
                value: `$${revenue.toFixed(2)}`,
            },
            {
                key: "total-expenses",
                label: "Total Expenses",
                value: `-$${expenses.toFixed(2)}`,
            },
            {
                key: "net-profit",
                label: "Net Profit",
                value: `${net >= 0 ? "" : "-"}$${Math.abs(net).toFixed(2)}`,
            },
            {
                key: "transaction-count",
                label: "Total Transactions",
                value: String(transactions.length),
            },
        ];
    }, [transactions, getTotalRevenue, getTotalExpenses, getNetProfit]);

    const handleSelectAll = (selected: boolean) => {
        if (selected) {
            setSelectedIds(new Set(transactions.map((t) => t.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectTransaction = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleDeleteSelected = () => {
        if (
            window.confirm(
                `Are you sure you want to delete ${selectedIds.size} transaction(s)?`
            )
        ) {
            selectedIds.forEach((id) => deleteTransaction(id));
            setSelectedIds(new Set());
        }
    };

    const handleDeleteTransaction = (id: string) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            deleteTransaction(id);
            setSelectedIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    };

    const handleAddTransaction = async (data: TransactionFormData) => {
        try {
            const result = await addTransaction(data);
            showToast(
                `Transaction completed — total: $${Math.abs(result.total_price).toFixed(2)}`
            );
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Transaction failed";
            showToast(msg, "error");
        }
    };

    // Sort transactions by date (newest first)
    const sortedTransactions = [...transactions].sort((a, b) => {
        return (
            new Date(b.time_of_transaction).getTime() -
            new Date(a.time_of_transaction).getTime()
        );
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-[#6941C6] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <TransactionsKpiRow kpis={computedKpis} />
            <TransactionsToolbar
                onAddTransaction={() => setIsFormOpen(true)}
                selectedCount={selectedIds.size}
                onDeleteSelected={handleDeleteSelected}
            />
            <div className="bg-white rounded-lg shadow">
                <TransactionsTable
                    transactions={sortedTransactions}
                    selectedIds={selectedIds}
                    onSelectAll={handleSelectAll}
                    onSelectTransaction={handleSelectTransaction}
                    onDelete={handleDeleteTransaction}
                />
            </div>

            <TransactionFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleAddTransaction}
                products={products}
            />
        </div>
    );
}
