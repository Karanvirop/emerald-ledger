import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { CATEGORIES, type Category } from '@/lib/expense-store';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (expense: { amount: number; description: string; category: Category; date: string }) => void;
}

export function AddExpenseModal({ open, onClose, onAdd }: Props) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('food');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit() {
    const errs: Record<string, string> = {};
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) errs.amount = 'Enter a valid amount';
    if (!description.trim()) errs.description = 'Enter a description';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onAdd({ amount: numAmount, description: description.trim(), category, date });
    toast.success('Expense added ✓');
    setAmount('');
    setDescription('');
    setCategory('food');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setErrors({});
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed z-50 bottom-0 inset-x-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md w-full"
          >
            <div className="glass-card rounded-t-3xl sm:rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-semibold text-lg">Add Expense</h2>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground btn-press text-xl leading-none">×</button>
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-lg">$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    autoFocus
                    value={amount}
                    onChange={e => { setAmount(e.target.value); setErrors(p => ({ ...p, amount: '' })); }}
                    placeholder="0.00"
                    className="w-full bg-secondary rounded-xl pl-9 pr-4 py-3.5 font-mono text-2xl font-semibold outline-none focus:ring-2 focus:ring-emerald/50 transition placeholder:text-muted-foreground/40"
                  />
                </div>
                {errors.amount && <p className="text-xs text-coral mt-1">{errors.amount}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={e => { setDescription(e.target.value); setErrors(p => ({ ...p, description: '' })); }}
                  placeholder="Coffee, groceries, uber..."
                  className="w-full bg-secondary rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald/50 transition placeholder:text-muted-foreground/40"
                />
                {errors.description && <p className="text-xs text-coral mt-1">{errors.description}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="text-xs text-muted-foreground block mb-2">Category</label>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(CATEGORIES) as Category[]).map(key => {
                    const cat = CATEGORIES[key];
                    const active = category === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setCategory(key)}
                        className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs transition btn-press ${
                          active ? 'bg-emerald/15 ring-1 ring-emerald text-foreground' : 'bg-secondary text-muted-foreground hover:bg-accent'
                        }`}
                      >
                        <span className="text-lg">{cat.emoji}</span>
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-secondary rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald/50 transition"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="w-full bg-emerald text-primary-foreground font-semibold py-3.5 rounded-xl btn-press hover:opacity-90 transition font-heading"
              >
                Add Expense
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
