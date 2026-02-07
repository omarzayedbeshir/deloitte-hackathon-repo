"use client";

import React from "react";
import Input from "@/components/ui/Input";
import SidebarNavItem from "./SidebarNavItem";
import IconButton from "@/components/ui/IconButton";
import { navItems } from "@/lib/dashboardMock";
import { useAuth } from "@/lib/AuthContext";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { username, logout } = useAuth();
    const initials = username ? username.slice(0, 2).toUpperCase() : "??";

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside style={{ maxHeight: "95vh" }}
                className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[280px] bg-white rounded-r-3xl lg:rounded-3xl shadow-lg
          flex flex-col h-screen lg:h-auto lg:m-4 lg:mr-0
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
            >
                {/* Logo */}
                <div className="px-6 pt-6 pb-4">
                    <div className="flex items-center gap-1">
                        <span className="text-xl font-bold text-[#6941C6]">AMO</span>
                        <span className="text-xl font-bold text-[#6941C6]">Inventory</span>
                        <span className="text-xl font-bold text-[#6941C6]">System</span>
                    </div>
                </div>

                {/* Search */}
                <div className="px-4 pb-4">
                    <Input
                        placeholder="Search"
                        leftIcon={
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
                                    stroke="currentColor"
                                    strokeWidth="1.67"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        }
                    />
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 overflow-y-auto">
                    <ul className="space-y-1">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <SidebarNavItem
                                    name={item.name}
                                    href={item.href}
                                    icon={item.icon}
                                />
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* User Profile */}
                <div className="mt-auto p-4 border-t border-[#EAECF0]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-medium">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#101828] truncate">
                                {username}
                            </p>
                        </div>
                        <IconButton aria-label="Logout" onClick={logout}>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M13.3333 14.1667L17.5 10M17.5 10L13.3333 5.83333M17.5 10H7.5M7.5 2.5H6.5C5.09987 2.5 4.3998 2.5 3.86502 2.77248C3.39462 3.01217 3.01217 3.39462 2.77248 3.86502C2.5 4.3998 2.5 5.09987 2.5 6.5V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5H7.5"
                                    stroke="currentColor"
                                    strokeWidth="1.67"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </IconButton>
                    </div>
                </div>
            </aside>
        </>
    );
}
