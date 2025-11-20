"use client";

import { useEffect, useState } from "react";
import { useRequireSession } from "@/components/session/use-require-session";

type Summary = {
  totals: { income: number; expense: number; balance: number };
  accounts: { count: number; balanceSum: number };
  recent: {
    id: string;
    type: string;
    amount: number;
    date: string;
    description?: string | null;
    account: { id: string; name: string } | null;
    category: { id: string; name: string } | null;
  }[];
  expensesByCategory: { categoryId: string; categoryName: string; amount: number }[];
};

export default function DashboardPage() {
  const { user, loading } = useRequireSession();
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch("/api/dashboard/summary")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => setError("Não foi possível carregar o dashboard"));
  }, [user]);

  if (loading || !user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-12">
        <p className="text-zinc-600">Carregando sessão...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-emerald-600">Dashboard</p>
        <h1 className="text-3xl font-bold text-zinc-900">Visão geral</h1>
        <p className="text-zinc-600">
          Totais de receitas, despesas, saldo e últimas movimentações.
        </p>
      </header>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Saldo" value={data?.totals.balance} variant="primary" />
        <StatCard label="Receitas" value={data?.totals.income} />
        <StatCard label="Despesas" value={data?.totals.expense} negative />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-zinc-800">Distribuição de despesas</p>
          {data?.expensesByCategory?.length ? (
            <ul className="mt-3 space-y-2 text-sm text-zinc-700">
              {data.expensesByCategory.map((cat) => (
                <li key={cat.categoryId} className="flex items-center justify-between">
                  <span>{cat.categoryName}</span>
                  <span className="font-semibold">R$ {cat.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-zinc-500">
              Sem despesas categorizadas ainda.
            </p>
          )}
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-800">Últimas transações</p>
            <a className="text-xs font-semibold text-emerald-700" href="/transactions">
              Ver todas
            </a>
          </div>
          <div className="divide-y divide-zinc-100">
            {data?.recent?.length ? (
              data.recent.map((tx) => (
                <div key={tx.id} className="py-3 text-sm text-zinc-700">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      {tx.description || "Sem descrição"}
                    </span>
                    <span
                      className={
                        tx.type === "income" ? "text-emerald-700" : "text-red-600"
                      }
                    >
                      {tx.type === "income" ? "+" : "-"} R$ {tx.amount.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    {tx.account?.name || "Conta"} · {tx.category?.name || "Categoria"} ·{" "}
                    {new Date(tx.date).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="py-3 text-sm text-zinc-500">
                Nenhuma transação recente.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  negative,
  variant,
}: {
  label: string;
  value?: number;
  negative?: boolean;
  variant?: "primary";
}) {
  const display = value !== undefined ? `R$ ${value.toFixed(2)}` : "—";
  const color =
    variant === "primary"
      ? "text-emerald-700"
      : negative
        ? "text-red-600"
        : "text-zinc-900";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${color}`}>{display}</p>
    </div>
  );
}
