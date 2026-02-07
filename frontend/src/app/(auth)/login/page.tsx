import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
    title: "Sign In - AMO Inventory System",
    description: "Sign in to your AMO Inventory System account",
};

export default function LoginPage() {
    return <LoginForm />;
}
