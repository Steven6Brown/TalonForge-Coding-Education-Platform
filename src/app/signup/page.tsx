import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = { title: "Create account", robots: { index: false } };

export default function SignupPage() {
  return (
    <AuthCard title="Create your account" subtitle="Free. We'll email a verification link.">
      <SignupForm />
    </AuthCard>
  );
}
