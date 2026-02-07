import React from "react";
import AuthBrandPanel from "./AuthBrandPanel";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">
            {/* Mobile Header - Shown only on small screens */}
            <header className="lg:hidden bg-[var(--brand-purple)] px-6 py-8">
                <div className="flex flex-col items-center text-center">
                    {/* Mobile Logo Pill */}
                    <div className="bg-white rounded-full px-6 py-3 shadow-lg mb-4">
                        <div className="flex items-center gap-1">
                            <span className="text-xl font-bold text-[var(--brand-purple)]">
                                AMO Inventory System
                            </span>

                        </div>
                    </div>
                    <p className="text-white/90 text-sm max-w-xs">
                        Re-imagining inventory management experience with advance data
                        analytics
                    </p>
                </div>
            </header>

            {/* Desktop Left Panel */}
            <AuthBrandPanel />

            {/* Right Panel - Form Area */}
            <main className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12 lg:py-0">
                <div className="w-full max-w-[420px]">{children}</div>
            </main>

            {/* Mobile Footer */}
            <footer className="lg:hidden text-center py-4 text-[var(--text-body)] text-sm">
                © AMO 2026
            </footer>
        </div>
    );
}
