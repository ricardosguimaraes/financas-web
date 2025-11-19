"use client";

import Link from "next/link";
import { useSession } from "@/components/session/session-context";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transactions", label: "Transações" },
  { href: "/categories", label: "Categorias" },
  { href: "/accounts", label: "Contas" },
];

export default function TopNav() {
  const { user, setUser } = useSession();

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-base font-semibold text-emerald-700">
          Finanças Web
        </Link>

        <nav className="hidden items-center gap-4 text-sm text-zinc-700 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded px-2 py-1 transition hover:bg-emerald-50 hover:text-emerald-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-sm text-zinc-700">
          {user ? (
            <>
              <span className="hidden sm:inline">
                {user.name || user.email}
              </span>
              <button
                onClick={() => setUser(null)}
                className="rounded-md border border-zinc-200 px-3 py-1 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md border border-zinc-200 px-3 py-1 transition hover:border-emerald-300 hover:text-emerald-700"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
