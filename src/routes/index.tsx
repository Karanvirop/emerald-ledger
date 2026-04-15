import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Toaster } from "sonner";
import { loadExpenses, addExpense as addExpenseToStore, type Expense, type Category } from "@/lib/expense-store";
import { StatCards } from "@/components/StatCards";
import { CategoryChart } from "@/components/CategoryChart";
import { TransactionList } from "@/components/TransactionList";
import { AddExpenseModal } from "@/components/AddExpenseModal";
import { PastExpenses } from "@/components/PastExpenses";
import { AnimatedNumber } from "@/components/AnimatedNumber";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Spndly — Personal Expense Tracker" },
      { name: "description", content: "Track your daily expenses with style. A premium personal finance tool." },
      { property: "og:title", content: "Spndly — Personal Expense Tracker" },
      { property: "og:description", content: "Track your daily expenses with style." },
    ],
  }),
  component: Index,
});

function Index() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tab, setTab] = useState<'month' | 'past'>('month');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setExpenses(loadExpenses());
  }, []);

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const thisMonthExpenses = useMemo(
    () => expenses.filter(e => {
      const d = new Date(e.date);
      return d >= monthStart && d <= monthEnd;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [expenses, monthStart.getTime(), monthEnd.getTime()]
  );

  const totalThisMonth = thisMonthExpenses.reduce((s, e) => s + e.amount, 0);

  function handleAdd(data: { amount: number; description: string; category: Category; date: string }) {
    setExpenses(prev => addExpenseToStore(prev, data));
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" theme="dark" />

      {/* Top Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="font-heading font-bold text-lg tracking-tight">
            <span className="text-emerald">S</span>pndly
          </h1>
          <div className="hidden sm:block text-center">
            <span className="text-xs text-muted-foreground">{format(now, 'MMMM yyyy')}</span>
            <span className="text-xs text-muted-foreground mx-2">·</span>
            <span className="text-xs font-mono text-muted-foreground">
              ${ totalThisMonth.toFixed(2) }
            </span>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-emerald text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5 btn-press hover:opacity-90 transition"
          >
            <span className="text-base leading-none">+</span>
            <span className="hidden sm:inline">Add Expense</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div className="relative flex bg-secondary rounded-xl p-1">
          {(['month', 'past'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative flex-1 py-2 text-sm font-medium z-10 transition btn-press ${
                tab === t ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {t === 'month' ? 'This Month' : 'Past Expenses'}
              {tab === t && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-0 bg-accent rounded-lg"
                  style={{ zIndex: -1 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {tab === 'month' ? (
            <motion.div
              key="month"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <StatCards expenses={thisMonthExpenses} />
              <CategoryChart expenses={thisMonthExpenses} />
              <div>
                <h3 className="text-sm text-muted-foreground mb-3 font-heading">Recent Transactions</h3>
                <TransactionList
                  expenses={thisMonthExpenses}
                  limit={8}
                  onViewAll={() => setTab('past')}
                />
              </div>
            </motion.div>
          ) : (
            <PastExpenses key="past" expenses={expenses} />
          )}
        </AnimatePresence>
      </main>

      <AddExpenseModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd} />
    </div>
  );
}
