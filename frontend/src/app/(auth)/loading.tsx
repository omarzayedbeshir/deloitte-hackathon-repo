// app/(auth)/loading.tsx
import Spinner from "@/components/ui/Spinner";

export default function AuthLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-3">
                <Spinner size="lg" variant="primary" label="Loading authentication" />
                <p className="text-sm text-[var(--text-body)]">Loading…</p>
            </div>
        </div>
    );
}
