import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);

  const addTransaction = (transaction) => {
    setTransactions([transaction, ...transactions]);
  };

  const updateTransaction = (id, updatedTransaction) => {
    setTransactions(transactions.map(t => t._id === id ? updatedTransaction : t));
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t._id !== id));
  };

  const addBudget = (budget) => {
    setBudgets([budget, ...budgets]);
  };

  const deleteBudget = (id) => {
    setBudgets(budgets.filter(b => b._id !== id));
  };

  const addCategory = (category) => {
    setCategories([category, ...categories]);
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter(c => c._id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        transactions,
        setTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        budgets,
        setBudgets,
        addBudget,
        deleteBudget,
        categories,
        setCategories,
        addCategory,
        deleteCategory,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
