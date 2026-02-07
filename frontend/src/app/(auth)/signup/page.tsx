import type { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
    title: "Create Account - AMO Inventory System",
    description: "Create your AMO Inventory System account",
};

export default function SignupPage() {
    return <SignupForm />;
}
