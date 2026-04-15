import { motion } from 'framer-motion';
import { AnimatedNumber } from './AnimatedNumber';
import type { Expense } from '@/lib/expense-store';
import { CATEGORIES } from '@/lib/expense-store';

export function StatCards({ expenses }: { expenses: Expense[] }) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  const categoryTotals = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const biggestCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  const stats = [
    {
      label: 'Total Spent',
      value: <AnimatedNumber value={total} />,
    },
    {
      label: 'Biggest Category',
      value: biggestCategory
        ? <span>{CATEGORIES[biggestCategory[0] as keyof typeof CATEGORIES].emoji} {CATEGORIES[biggestCategory[0] as keyof typeof CATEGORIES].label}</span>
        : <span className="text-muted-foreground">—</span>,
    },
    {
      label: 'Transactions',
      value: <span className="font-mono">{expenses.length}</span>,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="glass-card rounded-2xl p-5"
        >
          <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
          <p className="text-2xl font-semibold font-heading">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
