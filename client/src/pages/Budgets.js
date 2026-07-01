import React, { useState, useEffect } from 'react';
import { budgetService, categoryService } from '../services/api';
import { useData } from '../context/DataContext';

const Budgets = () => {
  const { budgets, setBudgets, transactions, categories, setCategories } = useData();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    month: new Date().toISOString().slice(0, 7),
  });

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBudgets = async () => {
    try {
      const res = await budgetService.getAll();
      setBudgets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAll();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await budgetService.create({ ...formData, limit: parseFloat(formData.limit) });
      setBudgets([res.data, ...budgets]);
      setFormData({ category: '', limit: '', month: new Date().toISOString().slice(0, 7) });
      setShowForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await budgetService.delete(id);
      setBudgets(budgets.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Case-insensitive match — "food" matches budget "Food" and transaction "food"
  const getSpent = (budgetCategory) =>
    transactions
      .filter(
        (t) =>
          t.type === 'expense' &&
          t.category.toLowerCase() === budgetCategory.toLowerCase()
      )
      .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--ink)' }}>Budgets</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            {budgets.length} active budget{budgets.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={showForm ? 'btn-secondary' : 'btn-primary'}
        >
          {showForm ? 'Discard' : '+ Create Budget'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card p-6 mb-6">
          <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--ink)' }}>New Budget</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

              {/* Category — free text with datalist suggestions from user categories */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>
                  Category
                </label>
                <input
                  type="text"
                  list="budget-category-suggestions"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Food"
                  className="airbnb-input"
                  required
                  autoComplete="off"
                />
                {/* Datalist populated from user's own categories */}
                <datalist id="budget-category-suggestions">
                  {categories.map((c) => (
                    <option key={c._id} value={c.name} />
                  ))}
                </datalist>
                {categories.length > 0 && (
                  <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                    Start typing to see your categories
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>
                  Budget Limit ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.limit}
                  onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                  placeholder="500.00"
                  className="airbnb-input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>Month</label>
                <input
                  type="month"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  className="airbnb-input"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Creating…' : 'Create Budget'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budget cards */}
      {budgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((budget) => {
            const spent     = getSpent(budget.category);
            const pct       = Math.min((spent / budget.limit) * 100, 100);
            const isOver    = spent > budget.limit;
            const remaining = budget.limit - spent;

            return (
              <div key={budget._id} className="card p-6">
                {/* Title row */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-base font-semibold" style={{ color: 'var(--ink)' }}>{budget.category}</h2>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{budget.month}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(budget._id)}
                    className="text-xs font-medium transition-colors"
                    style={{ color: 'var(--muted)' }}
                    onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}
                  >
                    Remove
                  </button>
                </div>

                {/* Amount row */}
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm" style={{ color: 'var(--muted)' }}>
                    ${spent.toFixed(2)} <span style={{ color: 'var(--hairline)' }}>of</span> ${budget.limit.toFixed(2)}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: isOver ? '#ef4444' : 'var(--muted)' }}>
                    {pct.toFixed(0)}%
                  </span>
                </div>

                {/* Progress */}
                <div className="progress-track mb-3">
                  <div
                    className={isOver ? 'progress-fill-over' : 'progress-fill-ok'}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Status */}
                <p className="text-xs font-medium" style={{ color: isOver ? '#ef4444' : '#10b981' }}>
                  {isOver
                    ? `↑ Over budget by $${(spent - budget.limit).toFixed(2)}`
                    : `$${remaining.toFixed(2)} remaining`}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        !showForm && (
          <div className="card py-16 text-center">
            <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
              No budgets yet. Create one to track your spending.
            </p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Create your first budget
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default Budgets;
