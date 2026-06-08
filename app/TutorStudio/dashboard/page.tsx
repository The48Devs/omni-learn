import { useAuth } from "@/app/components/AuthCOntext";

export default function TutorDashboard() {
    const { user } = useAuth();
    return (
        <main className="p-8 bg-[var(--bg-primary)] text-[var(--text-main)]">
            <h1 className="text-3xl font-bold mb-4">
                Welcome, {user ?? "Tutor"} (Tutor Dashboard)
            </h1>
        </main>
    );
}
