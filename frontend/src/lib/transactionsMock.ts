// lib/transactionsMock.ts

import { Transaction, TransactionKpi } from "./types";

export const initialTransactions: Transaction[] = [
    {
        id: "1",
        product_id: "1",
        product_name: "Droned Vape",
        transaction_type: "sale",
        product_quantity: 5,
        total_price: 225.0,
        time_of_transaction: "2026-02-05T14:30:00",
    },
    {
        id: "2",
        product_id: "3",
        product_name: "Cultyvate Edible",
        transaction_type: "sale",
        product_quantity: 12,
        total_price: 227.88,
        time_of_transaction: "2026-02-05T11:15:00",
    },
    {
        id: "3",
        product_id: "4",
        product_name: "Demi High Pod",
        transaction_type: "purchase",
        product_quantity: 20,
        total_price: -1100.0,
        time_of_transaction: "2026-02-04T09:45:00",
    },
    {
        id: "4",
        product_id: "1",
        product_name: "Droned Vape",
        transaction_type: "purchase",
        product_quantity: 30,
        total_price: -1350.0,
        time_of_transaction: "2026-02-03T16:20:00",
    },
    {
        id: "5",
        product_id: "6",
        product_name: "Natali Gummy Pack",
        transaction_type: "sale",
        product_quantity: 8,
        total_price: 100.0,
        time_of_transaction: "2026-02-03T13:00:00",
    },
    {
        id: "6",
        product_id: "2",
        product_name: "Crosscut E-Cig",
        transaction_type: "purchase",
        product_quantity: 25,
        total_price: -812.5,
        time_of_transaction: "2026-02-02T10:30:00",
    },
    {
        id: "7",
        product_id: "3",
        product_name: "Cultyvate Edible",
        transaction_type: "sale",
        product_quantity: 15,
        total_price: 284.85,
        time_of_transaction: "2026-02-01T15:45:00",
    },
    {
        id: "8",
        product_id: "5",
        product_name: "Cloud Nine Juice",
        transaction_type: "sale",
        product_quantity: 3,
        total_price: 66.0,
        time_of_transaction: "2026-01-31T12:10:00",
    },
    {
        id: "9",
        product_id: "1",
        product_name: "Droned Vape",
        transaction_type: "sale",
        product_quantity: 8,
        total_price: 360.0,
        time_of_transaction: "2026-01-30T14:50:00",
    },
    {
        id: "10",
        product_id: "4",
        product_name: "Demi High Pod",
        transaction_type: "sale",
        product_quantity: 6,
        total_price: 330.0,
        time_of_transaction: "2026-01-29T11:30:00",
    },
];

export const transactionKpis: TransactionKpi[] = [
    {
        key: "total-revenue",
        label: "Total Revenue",
        value: "$1,593.73",
    },
    {
        key: "total-expenses",
        label: "Total Expenses",
        value: "-$3,262.50",
    },
    {
        key: "net-profit",
        label: "Net Profit",
        value: "-$1,668.77",
    },
    {
        key: "transaction-count",
        label: "Total Transactions",
        value: "10",
    },
];
