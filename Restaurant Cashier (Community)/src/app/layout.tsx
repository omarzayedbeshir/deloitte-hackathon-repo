import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ONEWAY 7 - Restaurant Ordering",
  description: "Order delicious food from ONEWAY 7 restaurant",
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
