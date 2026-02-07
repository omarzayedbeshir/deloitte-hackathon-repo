// app/(dashboard)/transactions/page.tsx
import type { Metadata } from "next";
import TransactionsTableClient from "@/components/transactions/TransactionsTableClient";

export const metadata: Metadata = {
    title: "Transactions - AMO Dashboard",
    description: "Track all purchases and sales transactions",
};

export default function TransactionsPage() {
    return <TransactionsTableClient />;
}
