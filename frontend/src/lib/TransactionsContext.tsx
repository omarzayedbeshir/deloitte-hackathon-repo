// lib/TransactionsContext.tsx
"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from "react";
import type { Transaction, TransactionFormData } from "./types";
import { useAuth } from "./AuthContext";
import {
    fetchTransactions,
    createTransactionApi,
} from "./api/endpoints";

interface TransactionsContextValue {
    transactions: Transaction[];
    loading: boolean;
    addTransaction: (data: TransactionFormData) => Promise<{ total_price: number }>;
    deleteTransaction: (id: string) => void;
    refreshTransactions: () => Promise<void>;
    getTotalRevenue: () => number;
    getTotalExpenses: () => number;
    getNetProfit: () => number;
}

const TransactionsContext = createContext<TransactionsContextValue | null>(null);

export function TransactionsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { token } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshTransactions = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const data = await fetchTransactions(token);
            setTransactions(data);
        } catch (err) {
            console.error("Failed to fetch transactions:", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        refreshTransactions();
    }, [refreshTransactions]);

    const addTransaction = useCallback(
        async (data: TransactionFormData): Promise<{ total_price: number }> => {
            if (!token) throw new Error("Not authenticated");
            const result = await createTransactionApi(data, token);
            await refreshTransactions();
            return { total_price: result.total_price };
        },
        [token, refreshTransactions]
    );

    const deleteTransaction = useCallback((id: string) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const getTotalRevenue = useCallback(() => {
        return transactions
            .filter((t) => t.transaction_type === "sale")
            .reduce((sum, t) => sum + t.total_price, 0);
    }, [transactions]);

    const getTotalExpenses = useCallback(() => {
        return transactions
            .filter((t) => t.transaction_type === "purchase")
            .reduce((sum, t) => sum + Math.abs(t.total_price), 0);
    }, [transactions]);

    const getNetProfit = useCallback(() => {
        return transactions.reduce((sum, t) => sum + t.total_price, 0);
    }, [transactions]);

    return (
        <TransactionsContext.Provider
            value={{
                transactions,
                loading,
                addTransaction,
                deleteTransaction,
                refreshTransactions,
                getTotalRevenue,
                getTotalExpenses,
                getNetProfit,
            }}
        >
            {children}
        </TransactionsContext.Provider>
    );
}

export function useTransactions(): TransactionsContextValue {
    const context = useContext(TransactionsContext);
    if (!context) {
        throw new Error(
            "useTransactions must be used within TransactionsProvider"
        );
    }
    return context;
}
