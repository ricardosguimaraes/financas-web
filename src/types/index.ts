export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: string;
  balance: number;
  createdAt: string;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  type: "income" | "expense";
  amount: number;
  date: string;
  description?: string;
  recurring: boolean;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  limit: number;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  target: number;
  current: number;
}
