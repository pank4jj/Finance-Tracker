import React, { useState, useEffect } from 'react';
import { categoryService } from '../services/api';
import { useData } from '../context/DataContext';

const EMOJI_ICONS = ['💰', '🍔', '🏠', '🚗', '🎓', '🏥', '🎬', '✈️', '👕', '💪'];
const COLORS = ['#ff385c', '#e00b41', '#ff6b85', '#f97316', '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6'];

const CategoryPill = ({ label }) => (
  <span
    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
    style={{
      background: label === 'expense' ? '#fee2e2' : '#dcfce7',
      color: label === 'expense' ? '#991b1b' : '#166534',
    }}
  >
    {label}
  </span>
);

const Categories = () => {
  const { categories, setCategories } = useData();
  const [showForm, setShowForm]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [formData, setFormData]       = useState({
    name: '',
    type: 'expense',
    icon: EMOJI_ICONS[0],
    color: COLORS[0],
  });

  useEffect(() => { fetchCategories(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      const res = await categoryService.create(formData);
      setCategories([res.data, ...categories]);
      setFormData({ name: '', type: 'expense', icon: EMOJI_ICONS[0], color: COLORS[0] });
      setShowForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await categoryService.delete(id);
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const incomeCategories  = categories.filter((c) => c.type === 'income');

  const CategoryGrid = ({ items }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {items.map((cat) => (
        <div key={cat._id} className="card p-4 flex items-center gap-3 group">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
            style={{ background: cat.color + '22' }}
          >
            {cat.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--ink)' }}>{cat.name}</p>
            <CategoryPill label={cat.type} />
          </div>
          <button
            onClick={() => handleDelete(cat._id)}
            className="transition-colors opacity-0 group-hover:opacity-100 shrink-0"
            style={{ color: 'var(--muted-soft)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-soft)'}
            aria-label={`Delete ${cat.name}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--ink)' }}>Categories</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{categories.length} categories</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={showForm ? 'btn-secondary' : 'btn-primary'}
        >
          {showForm ? 'Discard' : '+ Add Category'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-6 mb-6">
          <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--ink)' }}>New Category</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Groceries, Netflix"
                  className="airbnb-input"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="airbnb-select"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>Icon</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="airbnb-select text-xl"
                >
                  {EMOJI_ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>Color</label>
                <div className="flex gap-2 flex-wrap pt-1">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                      style={{
                        backgroundColor: color,
                        borderColor: formData.color === color ? 'var(--ink)' : 'transparent',
                        outline: formData.color === color ? '2px solid var(--canvas)' : 'none',
                        outlineOffset: '-2px',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Adding…' : 'Add Category'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expense categories */}
      {expenseCategories.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--muted)' }}>Expense</h2>
          <CategoryGrid items={expenseCategories} />
        </section>
      )}

      {/* Income categories */}
      {incomeCategories.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--muted)' }}>Income</h2>
          <CategoryGrid items={incomeCategories} />
        </section>
      )}

      {/* Empty state */}
      {categories.length === 0 && !showForm && (
        <div className="card py-16 text-center">
          <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
            No categories yet. Add one to organize your transactions.
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Add your first category
          </button>
        </div>
      )}
    </div>
  );
};

export default Categories;
