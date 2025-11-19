import { FormEvent, useEffect, useState } from "react";
import { useRequireSession } from "@/components/session/use-require-session";

type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

const defaultColors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];
const defaultIcons = ["💳", "🍔", "🚗", "🏠", "🎯", "🛒", "📚", "🏥"];

export default function CategoriesPage() {
  const { user, loading } = useRequireSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState(defaultColors[0]);
  const [icon, setIcon] = useState(defaultIcons[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/categories?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setError("Não foi possível carregar categorias"));
  }, [user]);

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name,
          color,
          icon,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Erro ao criar categoria");
      } else {
        setCategories((prev) => [data, ...prev]);
        setName("");
      }
    } catch {
      setError("Erro ao criar categoria");
    } finally {
      setBusy(false);
    }
  }

  if (loading || !user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-12">
        <p className="text-zinc-600">Carregando sessão...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-emerald-600">Categorias</p>
        <h1 className="text-3xl font-bold text-zinc-900">Organização dos gastos</h1>
        <p className="text-zinc-600">
          Crie categorias com cor/ícone e veja listagem abaixo.
        </p>
      </header>

      <form
        onSubmit={handleCreate}
        className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm md:grid-cols-4"
      >
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-zinc-800">Nome</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Ex: Alimentação"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-zinc-800">Cor</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {defaultColors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`h-8 w-8 rounded-full border-2 ${
                  color === c ? "border-emerald-600" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-8 w-12 cursor-pointer rounded border border-zinc-300"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-zinc-800">Ícone</label>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {defaultIcons.map((ic) => (
              <button
                key={ic}
                type="button"
                onClick={() => setIcon(ic)}
                className={`rounded-lg border px-2 py-1 text-lg ${
                  icon === ic ? "border-emerald-500 bg-emerald-50" : "border-zinc-200"
                }`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-4">
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {busy ? "Criando..." : "Adicionar categoria"}
          </button>
        </div>
        {error && (
          <p className="md:col-span-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
      </form>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
              style={{ backgroundColor: cat.color }}
            >
              {cat.icon}
            </div>
            <div>
              <p className="text-base font-semibold text-zinc-900">{cat.name}</p>
              <p className="text-xs text-zinc-500">{cat.id}</p>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-zinc-600">
            Nenhuma categoria ainda. Adicione a primeira acima.
          </p>
        )}
      </div>
    </main>
  );
}
