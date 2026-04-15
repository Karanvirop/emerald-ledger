import { motion } from 'framer-motion';
import { format, isToday, isYesterday } from 'date-fns';
import type { Expense } from '@/lib/expense-store';
import { CATEGORIES, type Category } from '@/lib/expense-store';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d');
}

export function TransactionList({
  expenses,
  limit,
  onViewAll,
  grouped = false,
}: {
  expenses: Expense[];
  limit?: number;
  onViewAll?: () => void;
  grouped?: boolean;
}) {
  const items = limit ? expenses.slice(0, limit) : expenses;

  if (items.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-10 text-center">
        <p className="text-4xl mb-3">💸</p>
        <p className="text-muted-foreground text-sm">No expenses yet. Add your first one ↑</p>
      </div>
    );
  }

  if (grouped) {
    const groups: Record<string, Expense[]> = {};
    items.forEach(e => {
      const key = format(new Date(e.date), 'MMMM d');
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });

    return (
      <div className="space-y-4">
        {Object.entries(groups).map(([date, exps]) => (
          <div key={date}>
            <p className="text-xs text-muted-foreground mb-2 px-1 font-medium uppercase tracking-wider">{date}</p>
            <div className="glass-card rounded-2xl divide-y divide-border">
              {exps.map((e, i) => (
                <TransactionRow key={e.id} expense={e} index={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="glass-card rounded-2xl divide-y divide-border">
        {items.map((e, i) => (
          <TransactionRow key={e.id} expense={e} index={i} />
        ))}
      </div>
      {onViewAll && limit && expenses.length > limit && (
        <button
          onClick={onViewAll}
          className="w-full text-center text-sm text-emerald mt-3 hover:underline btn-press"
        >
          View All →
        </button>
      )}
    </div>
  );
}

function TransactionRow({ expense, index }: { expense: Expense; index: number }) {
  const cat = CATEGORIES[expense.category as Category];
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="flex items-center gap-3 px-4 py-3.5"
    >
      <span className="text-xl w-8 text-center">{cat.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{expense.description || cat.label}</p>
        <p className="text-xs text-muted-foreground">{formatDate(expense.date)}</p>
      </div>
      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground hidden sm:inline">
        {cat.label}
      </span>
      <span className="font-mono font-semibold text-coral text-sm">
        -${expense.amount.toFixed(2)}
      </span>
    </motion.div>
  );
}
