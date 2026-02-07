"use client";

import { useAuth } from "@/lib/AuthContext";
import { ProductsProvider } from "@/lib/ProductsContext";
import { TransactionsProvider } from "@/lib/TransactionsContext";
import { ToastProvider } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function DashboardGroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
                <div className="w-8 h-8 border-4 border-[#6941C6] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <ProductsProvider>
            <TransactionsProvider>
                <ToastProvider>
                    <DashboardLayout>{children}</DashboardLayout>
                </ToastProvider>
            </TransactionsProvider>
        </ProductsProvider>
    );
}
