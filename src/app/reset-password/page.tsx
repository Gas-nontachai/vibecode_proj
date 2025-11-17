import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const dynamic = "force-dynamic";

type ResetPasswordPageProps = {
  searchParams: {
    code?: string;
    token?: string;
  };
};

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const token = typeof searchParams.token === "string" ? searchParams.token : undefined;
  const code = typeof searchParams.code === "string" ? searchParams.code : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <ResetPasswordForm code={code ?? token} />
    </main>
  );
}
