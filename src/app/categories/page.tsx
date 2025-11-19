export default function CategoriesPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-emerald-600">Categorias</p>
        <h1 className="text-3xl font-bold text-zinc-900">Organização dos gastos</h1>
        <p className="text-zinc-600">
          Conecte com
          <code className="mx-1 rounded bg-zinc-100 px-1 py-0.5 text-sm">
            /api/categories
          </code>
          para criar/editar/excluir.
        </p>
      </header>

      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-6 text-zinc-500">
        Em breve: grid de cartões com cores/ícones e ações rápidas.
      </div>
    </main>
  );
}
