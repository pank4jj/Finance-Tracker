import React, { useState, useEffect } from 'react';
import { budgetService, transactionService } from '../services/api';
import { useData } from '../context/DataContext';

const Budgets = () => {
  const { budgets, setBudgets, transactions } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    month: new Date().toISOString().slice(0, 7),
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await budgetService.getAll();
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await budgetService.create({
        ...formData,
        limit: parseFloat(formData.limit),
      });
      setBudgets([response.data, ...budgets]);
      setFormData({
        category: '',
        limit: '',
        month: new Date().toISOString().slice(0, 7),
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await budgetService.delete(id);
      setBudgets(budgets.filter(b => b._id !== id));
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const getSpentAmount = (category) => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <div className="min-h-screen p-3 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-semibold text-[color:var(--muted)]">Budget Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:brightness-110"
          >
            {showForm ? 'Cancel' : 'Create Budget'}
          </button>
        </div>

        {showForm && (
          <div className="glass rounded-xl p-4 mb-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Budget Limit
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.limit}
                    onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Month
                  </label>
                  <input
                    type="month"
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Budget'}
              </button>
            </form>
          </div>
        )}

        {/* Budgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map(budget => {
            const spent = getSpentAmount(budget.category);
            const remaining = budget.limit - spent;
            const percentage = (spent / budget.limit) * 100;
            const isOverBudget = spent > budget.limit;

            return (
              <div
                key={budget._id}
                className={`glass rounded-xl p-4 ${isOverBudget ? 'ring-1 ring-red-600/30' : 'ring-1 ring-green-600/20'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{budget.category}</h2>
                    <p className="text-sm text-gray-500">{budget.month}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(budget._id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      ${spent.toFixed(2)} of ${budget.limit.toFixed(2)}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        isOverBudget ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isOverBudget ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {isOverBudget ? (
                      <span className="text-red-600 font-medium">
                        ⚠️ Over budget by ${(spent - budget.limit).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-green-600 font-medium">
                        ✓ ${remaining.toFixed(2)} remaining
                      </span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {budgets.length === 0 && !showForm && (
          <div className="text-center py-12">
            <p className="text-[color:var(--muted)] text-lg">No budgets created yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-primary-500 text-white px-6 py-2 rounded-lg hover:brightness-110"
            >
              Create Your First Budget
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budgets;
