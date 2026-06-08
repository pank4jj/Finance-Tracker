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

const EnhancedDashboard = () => {
  const { user } = useAuth();
  const { transactions, setTransactions, budgets, setBudgets } = useData();
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState({});

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    calculateMonthlyData();
    calculateCategoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);

  const fetchData = async () => {
    try {
      const [txnResponse, budgetResponse] = await Promise.all([
        transactionService.getAll(),
        budgetService.getAll(),
      ]);
      setTransactions(txnResponse.data || []);
      setBudgets(budgetResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const calculateMonthlyData = () => {
    const months = {};
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      months[monthKey] = { income: 0, expense: 0 };
    }

    transactions.forEach(txn => {
      const date = new Date(txn.date);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (months[monthKey]) {
        if (txn.type === 'income') months[monthKey].income += txn.amount;
        else months[monthKey].expense += txn.amount;
      }
    });

    const lastSixMonths = Object.entries(months)
      .slice(-6)
      .map(([month, data]) => ({ month, ...data }));

    setMonthlyData(lastSixMonths);
  };

  const calculateCategoryData = () => {
    const categories = {};
    const colors = ['#7C3AED', '#06B6D4', '#F97316', '#F43F5E', '#60A5FA', '#F59E0B'];
    let colorIndex = 0;

    transactions
      .filter(t => t.type === 'expense')
      .forEach(txn => {
        if (!categories[txn.category]) {
          categories[txn.category] = { amount: 0, color: colors[colorIndex % colors.length] };
          colorIndex++;
        }
        categories[txn.category].amount += txn.amount;
      });

    setCategoryData(categories);
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const chartData = {
    labels: monthlyData.map(m => m.month),
    datasets: [
      { label: 'Income', data: monthlyData.map(m => m.income), borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.08)', tension: 0.4 },
      { label: 'Expense', data: monthlyData.map(m => m.expense), borderColor: '#EF4444', backgroundColor: 'rgba(239,68,68,0.08)', tension: 0.4 },
    ],
  };

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [{ data: Object.values(categoryData).map(c => c.amount), backgroundColor: Object.values(categoryData).map(c => c.color), borderWidth: 2, borderColor: '#0b1220' }],
  };

  return (
    <div className="py-6">
      <h1 className="text-3xl md:text-4xl font-semibold mb-4">Welcome back, {user?.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass rounded-xl p-6">
          <h2 className="text-sm text-[color:var(--muted)] mb-2">Total Income</h2>
          <p className="text-2xl font-bold text-green-400">${totalIncome.toFixed(2)}</p>
          <p className="text-xs text-[color:var(--muted)] mt-2">All time income</p>
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="text-sm text-[color:var(--muted)] mb-2">Balance</h2>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-primary-300' : 'text-red-400'}`}>${balance.toFixed(2)}</p>
          <p className="text-xs text-[color:var(--muted)] mt-2">Income - Expense</p>
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="text-sm text-[color:var(--muted)] mb-2">Total Expense</h2>
          <p className="text-2xl font-bold text-red-400">${totalExpense.toFixed(2)}</p>
          <p className="text-xs text-[color:var(--muted)] mt-2">All time expenses</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 glass rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Income vs Expense Trend</h2>
          <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } }} />
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Expense by Category</h2>
          {Object.keys(categoryData).length > 0 ? <Pie data={pieData} /> : <p className="text-[color:var(--muted)]">No expense data</p>}
        </div>
      </div>

      {budgets.length > 0 && (
        <div className="glass rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Budget Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgets.map(budget => {
              const spent = transactions.filter(t => t.type === 'expense' && t.category === budget.category).reduce((sum, t) => sum + t.amount, 0);
              const percentage = (spent / budget.limit) * 100;
              const isOverBudget = percentage > 100;

              return (
                <div key={budget._id} className={`p-4 rounded-lg ${isOverBudget ? 'ring-1 ring-red-600/30' : 'ring-1 ring-green-600/20'}`}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{budget.category}</span>
                    <span className={isOverBudget ? 'text-red-400 font-bold' : 'text-green-400'}>{percentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-[rgba(255,255,255,0.03)] rounded-full h-2">
                    <div className={`${isOverBudget ? 'bg-red-500' : 'bg-green-400'} h-2 rounded-full`} style={{ width: `${Math.min(percentage, 100)}%` }} />
                  </div>
                  <p className="text-xs text-[color:var(--muted)] mt-2">${spent.toFixed(2)} of ${budget.limit.toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="glass rounded-xl">
        <div className="p-6 border-b border-[rgba(255,255,255,0.03)]">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-[color:var(--muted)] text-xs">
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 8).map(transaction => (
                <tr key={transaction._id} className="hover:bg-[rgba(255,255,255,0.02)] transition">
                  <td className="px-4 py-3 text-sm">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm">{transaction.category}</td>
                  <td className="px-4 py-3 text-sm">{transaction.description}</td>
                  <td className="px-4 py-3 text-sm"><span className={`px-2 py-1 rounded text-xs font-medium ${transaction.type === 'income' ? 'bg-green-800/20 text-green-300' : 'bg-red-800/20 text-red-300'}`}>{transaction.type}</span></td>
                  <td className="px-4 py-3 text-sm font-medium">${transaction.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
