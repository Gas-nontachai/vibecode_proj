import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

type ResetPasswordPageProps = {
  searchParams: {
    code?: string;
  };
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const code = typeof params.code === "string" ? params.code : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <ResetPasswordForm code={code} />
    </main>
  );
}
