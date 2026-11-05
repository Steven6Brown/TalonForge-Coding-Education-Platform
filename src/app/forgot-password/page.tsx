import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/PasswordResetForms";

export const metadata: Metadata = { title: "Reset password", robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <AuthCard title="Reset your password" subtitle="Enter your email and we'll send a reset link.">
      <ForgotPasswordForm />
    </AuthCard>
  );
}
