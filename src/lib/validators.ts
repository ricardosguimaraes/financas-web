import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const accountSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  balance: z.number().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1),
  color: z.string().min(1),
  icon: z.string().min(1),
});

export const transactionSchema = z.object({
  accountId: z.string().min(1),
  categoryId: z.string().min(1),
  type: z.enum(["income", "expense"]),
  amount: z.number(),
  date: z.string(),
  description: z.string().optional(),
  recurring: z.boolean().optional(),
});
