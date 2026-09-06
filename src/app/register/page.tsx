import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/forms/auth-form";
import { LoadingSpinner } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Register",
  robots: { index: false },
};

export default function RegisterPage() {
  return (
    <div className="section-padding pt-10">
      <div className="container-page">
        <Suspense
          fallback={
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          }
        >
          <AuthForm mode="register" />
        </Suspense>
      </div>
    </div>
  );
}
