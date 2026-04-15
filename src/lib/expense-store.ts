export type Category = 'food' | 'transport' | 'shopping' | 'bills' | 'health' | 'entertainment' | 'other';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: Category;
  date: string; // ISO string
  createdAt: string;
}

export const CATEGORIES: Record<Category, { emoji: string; label: string; color: string }> = {
  food: { emoji: '🍔', label: 'Food', color: 'var(--chart-3)' },
  transport: { emoji: '🚗', label: 'Transport', color: 'var(--chart-2)' },
  shopping: { emoji: '🛍️', label: 'Shopping', color: 'var(--chart-5)' },
  bills: { emoji: '💡', label: 'Bills', color: 'var(--chart-7)' },
  health: { emoji: '💊', label: 'Health', color: 'var(--chart-1)' },
  entertainment: { emoji: '🎬', label: 'Entertainment', color: 'var(--chart-4)' },
  other: { emoji: '📦', label: 'Other', color: 'var(--chart-6)' },
};

const STORAGE_KEY = 'spndly_expenses';

export function loadExpenses(): Expense[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveExpenses(expenses: Expense[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

export function addExpense(expenses: Expense[], expense: Omit<Expense, 'id' | 'createdAt'>): Expense[] {
  const newExpense: Expense = {
    ...expense,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const updated = [newExpense, ...expenses];
  saveExpenses(updated);
  return updated;
}

export function deleteExpense(expenses: Expense[], id: string): Expense[] {
  const updated = expenses.filter(e => e.id !== id);
  saveExpenses(updated);
  return updated;
}
