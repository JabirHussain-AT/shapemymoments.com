import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/forms/auth-form";
import { LoadingSpinner } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false },
};

export default function LoginPage() {
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
          <AuthForm mode="login" />
        </Suspense>
      </div>
    </div>
  );
}
