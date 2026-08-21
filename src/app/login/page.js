import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Log in — Threadly",
  description: "Sign in with your phone number to start chatting.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <LoginForm />
    </main>
  );
}
