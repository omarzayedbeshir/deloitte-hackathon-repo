"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <main className="flex-1 lg:ml-0 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="lg:px-8 lg:pt-8">
                        <HeaderBar onMenuClick={() => setSidebarOpen(true)} />
                    </div>

                    {/* Page Content */}
                    <div className="px-4 lg:px-8 py-6">{children}</div>
                </div>
            </main>
        </div>
    );
}
