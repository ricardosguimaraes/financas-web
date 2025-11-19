const links = [
  { href: "/login", label: "Login" },
  { href: "/register", label: "Criar conta" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transactions", label: "Transações" },
  { href: "/categories", label: "Categorias" },
  { href: "/accounts", label: "Contas" },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
      <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-emerald-600">Finanças Web</p>
        <h1 className="mt-3 text-3xl font-bold text-zinc-900">
          Sistema de gestão financeira pessoal
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-600">
          Este é o ponto de partida do app. Use os atalhos abaixo para acessar
          as páginas principais e testar as rotas da API enquanto construímos a
          interface definitiva.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {links.map((link) => (
          <a
            key={link.href}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-5 text-zinc-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            href={link.href}
          >
            <p className="text-base font-semibold">{link.label}</p>
            <p className="text-sm text-zinc-500">{link.href}</p>
          </a>
        ))}
      </section>
    </main>
  );
}
