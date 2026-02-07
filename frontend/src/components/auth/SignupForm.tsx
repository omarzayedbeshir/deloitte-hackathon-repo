"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import { apiPost } from "@/lib/api";

interface FormData {
    username: string;
    password: string;
    confirmPassword: string;
    agreeTerms: boolean;
}

interface FormErrors {
    username?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
    general?: string;
}

export default function SignupForm() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        username: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        } else if (formData.username.length < 3 || formData.username.length > 30) {
            newErrors.username = "Username must be 3–30 characters";
        } else if (/\s/.test(formData.username)) {
            newErrors.username = "Username cannot contain spaces";
        } else if (!/^[A-Za-z0-9._-]+$/.test(formData.username)) {
            newErrors.username = "Use only letters, numbers, dot (.), underscore (_), or hyphen (-)";
        } else if (!/^[A-Za-z0-9]/.test(formData.username) || !/[A-Za-z0-9]$/.test(formData.username)) {
            newErrors.username = "Username must start and end with a letter or number";
        } else if (/[._-]{2,}/.test(formData.username)) {
            newErrors.username = "Don’t use consecutive separators like '..', '__', or '--'";
        } else if (/^\d+$/.test(formData.username)) {
            newErrors.username = "Username can’t be numbers only";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!formData.agreeTerms) {
            newErrors.agreeTerms = "You must agree to the terms and privacy policy";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});
        setSuccessMessage("");

        try {
            const res = await apiPost<{ message?: string; error?: string }>("/auth/register", {
                username: formData.username,
                password: formData.password,
            });

            if (res.ok) {
                setSuccessMessage("Account created successfully! Redirecting to login…");
                setTimeout(() => router.push("/login"), 1500);
            } else {
                setErrors({ general: res.data.error || "Registration failed. Please try again." });
            }
        } catch {
            setErrors({ general: "Unable to connect to the server. Please try again later." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = () => {
        console.log("Google Sign Up clicked");
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-[32px] font-semibold text-[var(--text-title)] mb-2">
                    Create an account
                </h1>
                <p className="text-base text-[var(--text-body)]">
                    Let&apos;s get you started.
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

                {/* Success banner */}
                {successMessage && (
                    <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                        {successMessage}
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

                <TextInput
                    label="Confirm password"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    error={errors.confirmPassword}
                    required
                />

                {/* Terms Checkbox */}
                <Checkbox
                    label={
                        <span>
                            I agree to the{" "}
                            <Link
                                href="/terms"
                                className="text-[var(--brand-purple)] hover:text-[var(--brand-purple-hover)] transition-colors"
                            >
                                Terms
                            </Link>{" "}
                            &{" "}
                            <Link
                                href="/privacy"
                                className="text-[var(--brand-purple)] hover:text-[var(--brand-purple-hover)] transition-colors"
                            >
                                Privacy Policy
                            </Link>
                        </span>
                    }
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={(e) =>
                        setFormData({ ...formData, agreeTerms: e.target.checked })
                    }
                    error={errors.agreeTerms}
                />

                {/* Submit Button */}
                <Button type="submit" variant="primary" isLoading={isLoading}>
                    Create account
                </Button>
            </form>

            {/* Sign in link */}
            <p className="mt-8 text-center text-sm text-[var(--text-body)]">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="text-[var(--brand-purple)] hover:text-[var(--brand-purple-hover)] font-medium transition-colors"
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
}
