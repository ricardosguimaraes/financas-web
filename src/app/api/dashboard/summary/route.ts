import { NextResponse, type NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Prisma.TransactionWhereInput = { userId: user.id };
  if (from || to) {
    where.date = {};
    if (from) where.date.gte = new Date(from);
    if (to) where.date.lte = new Date(to);
  }

  const [
    incomeAgg,
    expenseAgg,
    accountsAgg,
    recentTransactions,
    expensesByCategory,
  ] = await Promise.all([
    prisma.transaction.aggregate({
      where: { ...where, type: "income" },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { ...where, type: "expense" },
      _sum: { amount: true },
    }),
    prisma.account.aggregate({
      where: { userId: user.id },
      _sum: { balance: true },
      _count: true,
    }),
    prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      take: 5,
      include: { account: true, category: true },
    }),
    prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { ...where, type: "expense" },
      _sum: { amount: true },
    }),
  ]);

  const categoryIds = expensesByCategory.map((c) => c.categoryId);
  const categories = categoryIds.length
    ? await prisma.category.findMany({
        where: { id: { in: categoryIds } },
      })
    : [];
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const income = incomeAgg._sum.amount ?? 0;
  const expense = expenseAgg._sum.amount ?? 0;
  const balance = income - expense + (accountsAgg._sum.balance ?? 0);

  return NextResponse.json({
    totals: {
      income,
      expense,
      balance,
    },
    accounts: {
      count: accountsAgg._count,
      balanceSum: accountsAgg._sum.balance ?? 0,
    },
    recent: recentTransactions.map((t) => ({
      id: t.id,
      type: t.type,
      amount: t.amount,
      date: t.date,
      description: t.description,
      account: t.account ? { id: t.account.id, name: t.account.name } : null,
      category: t.category
        ? { id: t.category.id, name: t.category.name }
        : null,
    })),
    expensesByCategory: expensesByCategory.map((c) => ({
      categoryId: c.categoryId,
      categoryName: categoryMap.get(c.categoryId)?.name ?? "Categoria",
      amount: c._sum.amount ?? 0,
    })),
  });
}
