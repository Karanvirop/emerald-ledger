import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, subMonths, addMonths, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import { TransactionList } from './TransactionList';
import { AnimatedNumber } from './AnimatedNumber';
import { CATEGORIES, type Category, type Expense } from '@/lib/expense-store';

export function PastExpenses({ expenses }: { expenses: Expense[] }) {
  const [current, setCurrent] = useState(subMonths(new Date(), 1));
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const start = startOfMonth(current);
    const end = endOfMonth(current);
    return expenses
      .filter(e => {
        const d = new Date(e.date);
        return d >= start && d <= end;
      })
      .filter(e => filter === 'all' || e.category === filter)
      .filter(e => !search || e.description.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, current, filter, search]);

  const total = filtered.reduce((s, e) => s + e.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Month selector */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setCurrent(subMonths(current, 1))}
          className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center btn-press hover:bg-accent transition text-lg"
        >
          ←
        </button>
        <div className="text-center min-w-[140px]">
          <p className="font-heading font-semibold">{format(current, 'MMMM yyyy')}</p>
          <p className="text-sm text-muted-foreground font-mono">
            <AnimatedNumber value={total} />
          </p>
        </div>
        <button
          onClick={() => setCurrent(addMonths(current, 1))}
          disabled={isSameMonth(addMonths(current, 1), new Date()) || addMonths(current, 1) > new Date()}
          className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center btn-press hover:bg-accent transition text-lg disabled:opacity-30"
        >
          →
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <FilterPill active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterPill>
        {(Object.keys(CATEGORIES) as Category[]).map(key => (
          <FilterPill key={key} active={filter === key} onClick={() => setFilter(key)}>
            {CATEGORIES[key].emoji} {CATEGORIES[key].label}
          </FilterPill>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search expenses..."
        className="w-full bg-secondary rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald/50 transition placeholder:text-muted-foreground/40"
      />

      <TransactionList expenses={filtered} grouped />
    </motion.div>
  );
}

function FilterPill({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition btn-press ${
        active ? 'bg-emerald text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-accent'
      }`}
    >
      {children}
    </button>
  );
}
