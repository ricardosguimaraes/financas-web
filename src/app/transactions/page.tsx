import { FormEvent, useEffect, useState } from "react";
import { useRequireSession } from "@/components/session/use-require-session";

type Account = { id: string; name: string };
type Category = { id: string; name: string };
type Transaction = {
  id: string;
  type: string;
  amount: number;
  date: string;
  description?: string;
  account: Account;
  category: Category;
};

export default function TransactionsPage() {
  const { user, loading } = useRequireSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState<number>(0);
  const [accountId, setAccountId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch(`/api/accounts?userId=${user.id}`).then((r) => r.json()),
      fetch(`/api/categories?userId=${user.id}`).then((r) => r.json()),
      fetch(`/api/transactions?userId=${user.id}`).then((r) => r.json()),
    ])
      .then(([acc, cat, tx]) => {
        setAccounts(acc);
        setCategories(cat);
        setTransactions(tx);
        if (acc[0]) setAccountId(acc[0].id);
        if (cat[0]) setCategoryId(cat[0].id);
      })
      .catch(() => setError("Erro ao carregar dados"));
  }, [user]);

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          accountId,
          categoryId,
          type,
          amount: Number(amount),
          date,
          description,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Erro ao criar transação");
      } else {
        // fetch includes account/category; quick way: refetch
        const updated = await fetch(`/api/transactions?userId=${user.id}`).then((r) =>
          r.json(),
        );
        setTransactions(updated);
        setAmount(0);
        setDescription("");
      }
    } catch {
      setError("Erro ao criar transação");
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
        <p className="text-sm font-semibold text-emerald-600">Transações</p>
        <h1 className="text-3xl font-bold text-zinc-900">Fluxo de caixa</h1>
        <p className="text-zinc-600">
          Adicione entradas/saídas e veja a lista abaixo (ordenada por data decrescente).
        </p>
      </header>

      <form
        onSubmit={handleCreate}
        className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm md:grid-cols-4"
      >
        <div>
          <label className="text-sm font-semibold text-zinc-800">Tipo</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "income" | "expense")}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="income">Receita</option>
            <option value="expense">Despesa</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-zinc-800">Valor</label>
          <input
            type="number"
            required
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="0"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-zinc-800">Data</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-zinc-800">Conta</label>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-zinc-800">Categoria</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-3">
          <label className="text-sm font-semibold text-zinc-800">Descrição</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Opcional"
          />
        </div>
        <div className="md:col-span-4">
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {busy ? "Salvando..." : "Adicionar transação"}
          </button>
        </div>
        {error && (
          <p className="md:col-span-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
      </form>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <p className="text-sm font-semibold text-zinc-800">Listagem</p>
          <p className="text-xs text-zinc-500">
            Total: {transactions.length} registro(s)
          </p>
        </div>

        <div className="divide-y divide-zinc-100">
          {transactions.map((tx) => (
            <div key={tx.id} className="grid gap-2 py-3 sm:grid-cols-4 sm:items-center">
              <div className="text-sm font-semibold text-zinc-900">
                {tx.description || "Sem descrição"}
              </div>
              <div className="text-sm text-zinc-600">
                {tx.account?.name || "Conta"}
              </div>
              <div className="text-sm text-zinc-600">
                {tx.category?.name || "Categoria"}
              </div>
              <div className="text-sm font-semibold">
                <span
                  className={
                    tx.type === "income" ? "text-emerald-700" : "text-red-600"
                  }
                >
                  {tx.type === "income" ? "+" : "-"} R$ {tx.amount.toFixed(2)}
                </span>
                <span className="ml-2 text-xs text-zinc-500">
                  {new Date(tx.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <p className="py-4 text-sm text-zinc-600">
              Nenhuma transação ainda. Adicione a primeira acima.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
