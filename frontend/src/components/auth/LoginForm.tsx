"use client";

import React, { useState } from "react";
import Link from "next/link";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import { apiPost } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

interface FormData {
    username: string;
    password: string;
    remember: boolean;
}

interface FormErrors {
    username?: string;
    password?: string;
    general?: string;
}

export default function LoginForm() {
    const { login } = useAuth();
    const [formData, setFormData] = useState<FormData>({
        username: "",
        password: "",
        remember: false,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const res = await apiPost<{ access_token?: string; error?: string }>("/auth/login", {
                username: formData.username,
                password: formData.password,
            });

            if (res.ok && res.data.access_token) {
                login(res.data.access_token, formData.username);
            } else {
                setErrors({ general: res.data.error || "Login failed. Please try again." });
            }
        } catch {
            setErrors({ general: "Unable to connect to the server. Please try again later." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        console.log("Google Sign In clicked");
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-[32px] font-semibold text-[var(--text-title)] mb-2">
                    Welcome back
                </h1>
                <p className="text-base text-[var(--text-body)]">
                    Welcome back! Please enter your details.
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* General error banner */}
                {errors.general && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                        {errors.general}
                    </div>
                )}

                <TextInput
                    label="Username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    error={errors.username}
                    required
                />

                <TextInput
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                    }
                    error={errors.password}
                    required
                />

                {/* Remember me & Forgot password row */}
                <div className="flex items-center justify-between">
                    <Checkbox
                        label="Remember for 30 days"
                        name="remember"
                        checked={formData.remember}
                        onChange={(e) =>
                            setFormData({ ...formData, remember: e.target.checked })
                        }
                    />
                    <Link
                        href="/forgot-password"
                        className="text-sm text-[var(--brand-purple)] hover:text-[var(--brand-purple-hover)] font-medium transition-colors"
                    >
                        Forgot password
                    </Link>
                </div>

                {/* Submit Button */}
                <Button type="submit" variant="primary" isLoading={isLoading}>
                    Sign in
                </Button>
            </form>

            {/* Sign up link */}
            <p className="mt-8 text-center text-sm text-[var(--text-body)]">
                Don&apos;t have an account?{" "}
                <Link
                    href="/signup"
                    className="text-[var(--brand-purple)] hover:text-[var(--brand-purple-hover)] font-medium transition-colors"
                >
                    Sign up
                </Link>
            </p>
        </div>
    );
}
