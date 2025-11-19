export default function AccountsPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-emerald-600">Contas</p>
        <h1 className="text-3xl font-bold text-zinc-900">Bancos, carteiras e cartões</h1>
        <p className="text-zinc-600">
          Usar a rota
          <code className="mx-1 rounded bg-zinc-100 px-1 py-0.5 text-sm">
            /api/accounts
          </code>
          para CRUD enquanto montamos a UI.
        </p>
      </header>

      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-6 text-zinc-500">
        Em breve: listagem de contas e ação de transferir saldo.
      </div>
    </main>
  );
}
