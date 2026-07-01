import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { transactionService, categoryService } from '../services/api';

// Fallback built-in categories (used only when user has no custom ones)
const BUILTIN_CATEGORIES = [
  'Food', 'Housing', 'Transport', 'Health', 'Education',
  'Entertainment', 'Shopping', 'Travel', 'Salary', 'Freelance', 'Other',
];

const TransactionsPage = () => {
  const {
    transactions, setTransactions,
    addTransaction, updateTransaction, deleteTransaction,
    categories, setCategories,
  } = useData();

  const [showForm, setShowForm]     = useState(false);
  const [editingId, setEditingId]   = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading]       = useState(false);

  // Merge user categories with builtins — user categories take precedence
  const userCategoryNames = categories.map((c) => c.name);
  const allCategories = userCategoryNames.length > 0
    ? userCategoryNames
    : BUILTIN_CATEGORIES;

  const emptyForm = {
    type: 'expense',
    category: allCategories[0] || '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // When categories load, update the default form category if it hasn't been touched
  useEffect(() => {
    if (categories.length > 0 && !editingId) {
      setFormData((prev) => ({
        ...prev,
        category: prev.category || categories[0].name,
      }));
    }
  }, [categories]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTransactions = async () => {
    try {
      const res = await transactionService.getAll();
      setTransactions(res.data);
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
      const payload = { ...formData, amount: parseFloat(formData.amount) };
      if (editingId) {
        const res = await transactionService.update(editingId, payload);
        updateTransaction(editingId, res.data);
        setEditingId(null);
      } else {
        const res = await transactionService.create(payload);
        addTransaction(res.data);
      }
      setFormData({ ...emptyForm, category: allCategories[0] || '' });
      setShowForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (t) => {
    setFormData({
      type: t.type,
      category: t.category,
      amount: t.amount.toString(),
      description: t.description,
      date: new Date(t.date).toISOString().split('T')[0],
    });
    setEditingId(t._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await transactionService.delete(id);
      deleteTransaction(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ ...emptyForm, category: allCategories[0] || '' });
  };

  const filtered = transactions.filter((t) => {
    const typeOk   = filterType === 'all' || t.type === filterType;
    const searchOk = t.category.toLowerCase().includes(searchTerm.toLowerCase())
                  || t.description.toLowerCase().includes(searchTerm.toLowerCase());
    return typeOk && searchOk;
  });

  // Split categories by type for smarter grouping in dropdown
  const expenseCats = categories.filter((c) => c.type === 'expense').map((c) => c.name);
  const incomeCats  = categories.filter((c) => c.type === 'income').map((c) => c.name);
  const hasCustomCats = categories.length > 0;

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--ink)' }}>Transactions</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{transactions.length} total</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); if (showForm) handleCancel(); }}
          className={showForm ? 'btn-secondary' : 'btn-primary'}
        >
          {showForm ? 'Discard' : '+ Add Transaction'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-6 mb-6">
          <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--ink)' }}>
            {editingId ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

              {/* Type */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="airbnb-select"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              {/* Category — uses user's own categories, grouped */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="airbnb-select"
                >
                  {hasCustomCats ? (
                    <>
                      {expenseCats.length > 0 && (
                        <optgroup label="Expense">
                          {expenseCats.map((c) => <option key={c} value={c}>{c}</option>)}
                        </optgroup>
                      )}
                      {incomeCats.length > 0 && (
                        <optgroup label="Income">
                          {incomeCats.map((c) => <option key={c} value={c}>{c}</option>)}
                        </optgroup>
                      )}
                    </>
                  ) : (
                    BUILTIN_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)
                  )}
                </select>
                {!hasCustomCats && (
                  <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                    Tip: Create custom categories in the <a href="/categories" style={{ color: 'var(--rausch)' }}>Categories</a> page.
                  </p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="airbnb-input"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="airbnb-input"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What was this for?"
                className="airbnb-input"
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Saving…' : editingId ? 'Update' : 'Add Transaction'}
              </button>
              <button type="button" onClick={handleCancel} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>Filter by type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="airbnb-select"
              style={{ height: 'auto', padding: '8px 12px' }}
            >
              <option value="all">All transactions</option>
              <option value="income">Income only</option>
              <option value="expense">Expenses only</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>Search</label>
            <input
              type="text"
              placeholder="Category or description…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="airbnb-input"
              style={{ height: 'auto', padding: '8px 12px' }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--hairline)', background: 'var(--surface-soft)' }}>
                {['Date', 'Category', 'Description', 'Type', 'Amount', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t._id} style={{ borderBottom: '1px solid var(--hairline-soft)' }}
                    className="transition-colors hover:bg-surface-soft">
                  <td className="px-6 py-4 text-sm whitespace-nowrap" style={{ color: 'var(--muted)' }}>
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium" style={{ color: 'var(--ink)' }}>{t.category}</td>
                  <td className="px-6 py-4 text-sm max-w-xs truncate" style={{ color: 'var(--ink-body)' }}>{t.description}</td>
                  <td className="px-6 py-4">
                    <span className={t.type === 'income' ? 'badge-income' : 'badge-expense'}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold whitespace-nowrap"
                      style={{ color: t.type === 'income' ? '#10b981' : '#ef4444' }}>
                    {t.type === 'income' ? '+' : '−'}${t.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(t)}
                        className="text-sm font-medium transition-colors"
                        style={{ color: 'var(--ink)' }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--rausch)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--ink)'}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="text-sm font-medium transition-colors"
                        style={{ color: 'var(--muted)' }}
                        onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              {searchTerm || filterType !== 'all' ? 'No matching transactions.' : 'No transactions yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
