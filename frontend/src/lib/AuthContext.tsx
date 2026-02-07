"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
    token: string | null;
    username: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, username: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Hydrate from localStorage on mount
        const storedToken = localStorage.getItem("access_token");
        const storedUsername = localStorage.getItem("username");
        if (storedToken) {
            setToken(storedToken);
            setUsername(storedUsername);
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(
        (newToken: string, newUsername: string) => {
            localStorage.setItem("access_token", newToken);
            localStorage.setItem("username", newUsername);
            setToken(newToken);
            setUsername(newUsername);
            router.push("/overview");
        },
        [router]
    );

    const logout = useCallback(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("username");
        setToken(null);
        setUsername(null);
        router.push("/login");
    }, [router]);

    return (
        <AuthContext.Provider
            value={{
                token,
                username,
                isAuthenticated: !!token,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}
