export default function DashboardPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-emerald-600">Dashboard</p>
        <h1 className="text-3xl font-bold text-zinc-900">
          Visão geral das finanças
        </h1>
        <p className="text-zinc-600">
          Placeholder para cards de saldo, receitas, despesas e gráficos
          (linhas e pizza). Conecte às rotas de transações para dados reais.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["Saldo", "Receitas", "Despesas"].map((label) => (
          <div
            key={label}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-zinc-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-900">
              Em implementação
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-zinc-800">Gráfico por categoria</p>
          <p className="mt-2 text-zinc-600">Reservado para pizza.</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-zinc-800">Evolução mensal</p>
          <p className="mt-2 text-zinc-600">Reservado para linha/barras.</p>
        </div>
      </div>
    </main>
  );
}
