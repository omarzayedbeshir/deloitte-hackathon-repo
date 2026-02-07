import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AMO Inventory System - Restaurant Ordering",
  description: "The best cashier application ever for the best financial gains",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
