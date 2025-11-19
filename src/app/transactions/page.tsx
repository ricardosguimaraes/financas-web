export default function TransactionsPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-emerald-600">Transações</p>
        <h1 className="text-3xl font-bold text-zinc-900">Fluxo de caixa</h1>
        <p className="text-zinc-600">
          Lista e filtros virão aqui. Dados podem ser obtidos via
          <code className="mx-1 rounded bg-zinc-100 px-1 py-0.5 text-sm">
            /api/transactions
          </code>
          (filtros: userId, type, accountId, categoryId, from, to).
        </p>
      </header>

      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-6 text-zinc-500">
        Em breve: tabela com filtros, ação de criar/editar/excluir.
      </div>
    </main>
  );
}
