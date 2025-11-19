"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRequireSession } from "@/components/session/use-require-session";

type Account = {
  id: string;
  name: string;
  type: string;
  balance: number;
};

const accountTypes = ["Conta bancária", "Carteira", "Cartão de crédito", "Investimento"];

export default function AccountsPage() {
  const { user, loading } = useRequireSession();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState(accountTypes[0]);
  const [balance, setBalance] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/accounts?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setAccounts(data))
      .catch(() => setError("Não foi possível carregar contas"));
  }, [user]);

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name,
          type,
          balance: Number(balance),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Erro ao criar conta");
      } else {
        setAccounts((prev) => [data, ...prev]);
        setName("");
        setBalance(0);
      }
    } catch {
      setError("Erro ao criar conta");
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
        <p className="text-sm font-semibold text-emerald-600">Contas</p>
        <h1 className="text-3xl font-bold text-zinc-900">Bancos, carteiras e cartões</h1>
        <p className="text-zinc-600">
          Gerencie suas contas. Use o formulário para adicionar e veja a lista abaixo.
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
            placeholder="Ex: Nubank"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-zinc-800">Tipo</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {accountTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-zinc-800">Saldo inicial</label>
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="0"
          />
        </div>
        <div className="md:col-span-4">
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {busy ? "Criando..." : "Adicionar conta"}
          </button>
        </div>
        {error && (
          <p className="md:col-span-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-zinc-500">{acc.type}</p>
            <h3 className="text-lg font-semibold text-zinc-900">{acc.name}</h3>
            <p className="text-sm text-emerald-700">
              Saldo: R$ {acc.balance.toFixed(2)}
            </p>
          </div>
        ))}
        {accounts.length === 0 && (
          <p className="text-sm text-zinc-600">
            Nenhuma conta ainda. Adicione a primeira acima.
          </p>
        )}
      </div>
    </main>
  );
}
