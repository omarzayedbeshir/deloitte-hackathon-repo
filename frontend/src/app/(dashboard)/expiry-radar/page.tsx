// app/(dashboard)/expiry-radar/page.tsx

import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ExpiryRadarPageClient from "@/components/expiryRadar/ExpiryRadarPageClient";

export const metadata = {
    title: "Expiry Radar | AMO Inventory",
};

export default function ExpiryRadarPage() {
    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <Link
                    href="/overview"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </Link>

                <h1 className="text-2xl font-semibold text-gray-900">Expiry Radar</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Track product expiry dates and identify at-risk inventory.
                </p>
            </div>

            {/* Client-side interactive content */}
            <ExpiryRadarPageClient />
        </div>
    );
}
