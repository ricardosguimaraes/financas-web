export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-6 py-12">
      <h1 className="text-3xl font-bold text-zinc-900">Login</h1>
      <p className="text-zinc-600">
        Em breve: formulário de autenticação. Por enquanto, use a rota
        <code className="mx-1 rounded bg-zinc-100 px-1 py-0.5 text-sm">/api/auth/login</code>
        com email e senha.
      </p>
    </main>
  );
}
