import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { Expense } from '@/lib/expense-store';
import { CATEGORIES, type Category } from '@/lib/expense-store';

const CHART_COLORS = ['#00D084', '#5B8DEF', '#FFB347', '#FF6B6B', '#C084FC', '#67E8F9', '#FBBF24'];

export function CategoryChart({ expenses }: { expenses: Expense[] }) {
  const categoryTotals = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const data = Object.entries(categoryTotals)
    .map(([key, value]) => ({
      name: CATEGORIES[key as Category].label,
      emoji: CATEGORIES[key as Category].emoji,
      value,
      pct: total > 0 ? ((value / total) * 100).toFixed(1) : '0',
    }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="text-sm text-muted-foreground mb-4 font-heading">Category Breakdown</h3>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1a1d2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 13 }}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2 w-full">
          {data.map((item, i) => (
            <div key={item.name} className="flex items-center gap-3 text-sm">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              <span className="flex-1">{item.emoji} {item.name}</span>
              <span className="text-muted-foreground font-mono text-xs">{item.pct}%</span>
              <span className="font-mono font-medium w-20 text-right">${item.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
