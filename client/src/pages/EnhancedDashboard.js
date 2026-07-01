import React, { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { transactionService, budgetService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

/* ── Stat card ── */
const StatCard = ({ label, value, sub, valueColor }) => (
  <div className="card p-6">
    <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">{label}</p>
    <p className="text-2xl font-semibold text-ink" style={valueColor ? { color: valueColor } : {}}>
      {value}
    </p>
    {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
  </div>
);

const EnhancedDashboard = () => {
  const { user } = useAuth();
  const { transactions, setTransactions, budgets, setBudgets } = useData();
  const [monthlyData, setMonthlyData]   = useState([]);
  const [categoryData, setCategoryData] = useState({});

  useEffect(() => { fetchData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    calculateMonthlyData();
    calculateCategoryData();
  }, [transactions]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    try {
      const [txnRes, budgetRes] = await Promise.all([
        transactionService.getAll(),
        budgetService.getAll(),
      ]);
      setTransactions(txnRes.data || []);
      setBudgets(budgetRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const calculateMonthlyData = () => {
    const months = {};
    const year = new Date().getFullYear();
    for (let i = 0; i < 12; i++) {
      const key = new Date(year, i, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      months[key] = { income: 0, expense: 0 };
    }
    transactions.forEach((t) => {
      const key = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (months[key]) {
        if (t.type === 'income') months[key].income += t.amount;
        else months[key].expense += t.amount;
      }
    });
    setMonthlyData(Object.entries(months).slice(-6).map(([month, d]) => ({ month, ...d })));
  };

  const calculateCategoryData = () => {
    // Use Rausch-adjacent palette for pie slices
    const palette = ['#ff385c', '#e00b41', '#ff6b85', '#ff9eb5', '#ffcbd8', '#3f3f3f'];
    const cats = {};
    let ci = 0;
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        if (!cats[t.category]) {
          cats[t.category] = { amount: 0, color: palette[ci % palette.length] };
          ci++;
        }
        cats[t.category].amount += t.amount;
      });
    setCategoryData(cats);
  };

  const totalIncome  = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance      = totalIncome - totalExpense;

  /* Chart.js — light theme options */
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#6a6a6a', font: { size: 12, family: 'Inter' }, boxWidth: 12, padding: 16 },
      },
    },
    scales: {
      x: { ticks: { color: '#6a6a6a', font: { size: 11 } }, grid: { color: '#ebebeb' } },
      y: { ticks: { color: '#6a6a6a', font: { size: 11 } }, grid: { color: '#ebebeb' }, beginAtZero: true },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#6a6a6a', font: { size: 12, family: 'Inter' }, boxWidth: 12, padding: 12 } },
    },
  };

  const lineData = {
    labels: monthlyData.map((m) => m.month),
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map((m) => m.income),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.06)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#10b981',
      },
      {
        label: 'Expense',
        data: monthlyData.map((m) => m.expense),
        borderColor: '#ff385c',
        backgroundColor: 'rgba(255,56,92,0.06)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#ff385c',
      },
    ],
  };

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [{
      data: Object.values(categoryData).map((c) => c.amount),
      backgroundColor: Object.values(categoryData).map((c) => c.color),
      borderWidth: 2,
      borderColor: '#ffffff',
    }],
  };

  return (
    <div className="py-6">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-ink">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-sm text-muted mt-1">Here's your financial overview</p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Income"
          value={`$${totalIncome.toFixed(2)}`}
          sub="All-time income"
          valueColor="#10b981"
        />
        <StatCard
          label="Net Balance"
          value={`$${balance.toFixed(2)}`}
          sub="Income minus expenses"
          valueColor={balance >= 0 ? '#10b981' : '#ef4444'}
        />
        <StatCard
          label="Total Expenses"
          value={`$${totalExpense.toFixed(2)}`}
          sub="All-time spending"
          valueColor="#ef4444"
        />
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-sm font-semibold text-ink mb-4">Income vs Expenses — Last 6 Months</h2>
          <Line data={lineData} options={chartOptions} />
        </div>

        <div className="card p-6">
          <h2 className="text-sm font-semibold text-ink mb-4">Spending by Category</h2>
          {Object.keys(categoryData).length > 0
            ? <Pie data={pieData} options={pieOptions} />
            : <p className="text-sm text-muted">No expense data yet.</p>
          }
        </div>
      </div>

      {/* ── Budget overview ── */}
      {budgets.length > 0 && (
        <div className="card p-6 mb-8">
          <h2 className="text-sm font-semibold text-ink mb-4">Budget Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgets.map((budget) => {
              const spent      = transactions.filter((t) => t.type === 'expense' && t.category === budget.category).reduce((s, t) => s + t.amount, 0);
              const pct        = Math.min((spent / budget.limit) * 100, 100);
              const isOver     = spent > budget.limit;

              return (
                <div key={budget._id} className="p-4 rounded-md border border-hairline">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-ink">{budget.category}</span>
                    <span className="text-xs font-semibold" style={{ color: isOver ? '#ef4444' : 'var(--muted)' }}>
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                  <div className="progress-track mb-2">
                    <div
                      className={isOver ? 'progress-fill-over' : 'progress-fill-ok'}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted">
                    ${spent.toFixed(2)} <span className="text-hairline-soft">of</span> ${budget.limit.toFixed(2)}
                    {isOver && (
                      <span className="ml-2 text-red-500 font-medium">
                        ↑ ${(spent - budget.limit).toFixed(2)} over
                      </span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Recent transactions ── */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-hairline">
          <h2 className="text-sm font-semibold text-ink">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-hairline">
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 8).map((t) => (
                <tr key={t._id} className="border-b border-hairline-soft hover:bg-surface-soft transition-colors">
                  <td className="px-6 py-3 text-sm text-muted">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="px-6 py-3 text-sm font-medium text-ink">{t.category}</td>
                  <td className="px-6 py-3 text-sm text-ink-body">{t.description}</td>
                  <td className="px-6 py-3">
                    <span className={t.type === 'income' ? 'badge-income' : 'badge-expense'}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold" style={{ color: t.type === 'income' ? '#10b981' : '#ef4444' }}>
                    {t.type === 'income' ? '+' : '−'}${t.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {transactions.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-muted">No transactions yet. Add one to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
