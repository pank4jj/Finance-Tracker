import React, { useState, useEffect } from 'react';
import { categoryService } from '../services/api';
import { useData } from '../context/DataContext';

const EMOJI_ICONS = ['💰', '🍔', '🏠', '🚗', '🎓', '🏥', '🎬', '✈️', '👕', '💪'];
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B195', '#FF6B9D'];

const Categories = () => {
  const { categories, setCategories } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    icon: EMOJI_ICONS[0],
    color: COLORS[0],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await categoryService.create(formData);
      setCategories([response.data, ...categories]);
      setFormData({
        name: '',
        type: 'expense',
        icon: EMOJI_ICONS[0],
        color: COLORS[0],
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await categoryService.delete(id);
      setCategories(categories.filter(c => c._id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const expenseCategories = categories.filter(c => c.type === 'expense');
  const incomeCategories = categories.filter(c => c.type === 'income');

  return (
    <div className="min-h-screen p-3 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-semibold text-[color:var(--muted)]">Manage Categories</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:brightness-110"
          >
            {showForm ? 'Cancel' : 'Add Category'}
          </button>
        </div>

        {showForm && (
          <div className="glass rounded-xl p-4 mb-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Groceries, Netflix"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Icon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl"
                  >
                    {EMOJI_ICONS.map(icon => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-10 h-10 rounded-lg border-2 ${
                          formData.color === color ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      ></button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Add Category'}
              </button>
            </form>
          </div>
        )}

        {/* Expense Categories */}
        {expenseCategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Expense Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {expenseCategories.map(cat => (
                <div
                  key={cat._id}
                  className="glass rounded-lg p-3 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-2xl md:text-3xl" style={{ backgroundColor: 'transparent' }}>{cat.icon}</span>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="font-medium text-[color:var(--muted)]">{cat.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Income Categories */}
        {incomeCategories.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Income Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {incomeCategories.map(cat => (
                  <div
                    key={cat._id}
                    className="glass rounded-lg p-3 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-2xl md:text-3xl" style={{ backgroundColor: 'transparent' }}>{cat.icon}</span>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="font-medium text-[color:var(--muted)]">{cat.name}</p>
                  </div>
              ))}
            </div>
          </div>
        )}

        {categories.length === 0 && !showForm && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No categories created yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Create Your First Category
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
