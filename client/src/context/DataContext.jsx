import React, { createContext, useContext, useState, useEffect } from 'react';
import { getIncomes, addIncome, updateIncome, deleteIncome } from '../services/incomeService';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../services/expenseService';

// Контекст для данных
const DataContext = createContext(null);

/**
 * Хук для использования контекста данных
 * @returns {Object} Объект с данными и методами управления
 */
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

/**
 * Провайдер контекста данных
 */
export const DataProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка данных при монтировании
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Загружаем доходы и расходы параллельно
        const [incomesResult, expensesResult] = await Promise.all([
          getIncomes(),
          getExpenses(),
        ]);
        
        setIncomes(incomesResult.data || []);
        setExpenses(expensesResult.data || []);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError(err.message || 'Не удалось загрузить данные');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Методы для доходов
  const handleAddIncome = async (incomeData) => {
    try {
      const newIncome = await addIncome(incomeData);
      setIncomes((prev) => [...prev, newIncome]);
      return newIncome;
    } catch (err) {
      console.error('Ошибка при добавлении дохода:', err);
      throw err;
    }
  };

  const handleUpdateIncome = async (id, incomeData) => {
    try {
      const updatedIncome = await updateIncome(id, incomeData);
      setIncomes((prev) => prev.map((inc) => (inc.id === id ? updatedIncome : inc)));
      return updatedIncome;
    } catch (err) {
      console.error('Ошибка при обновлении дохода:', err);
      throw err;
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      await deleteIncome(id);
      setIncomes((prev) => prev.filter((inc) => inc.id !== id));
      return true;
    } catch (err) {
      console.error('Ошибка при удалении дохода:', err);
      throw err;
    }
  };

  // Методы для расходов
  const handleAddExpense = async (expenseData) => {
    try {
      const newExpense = await addExpense(expenseData);
      setExpenses((prev) => [...prev, newExpense]);
      return newExpense;
    } catch (err) {
      console.error('Ошибка при добавлении расхода:', err);
      throw err;
    }
  };

  const handleUpdateExpense = async (id, expenseData) => {
    try {
      const updatedExpense = await updateExpense(id, expenseData);
      setExpenses((prev) => prev.map((exp) => (exp.id === id ? updatedExpense : exp)));
      return updatedExpense;
    } catch (err) {
      console.error('Ошибка при обновлении расхода:', err);
      throw err;
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
      return true;
    } catch (err) {
      console.error('Ошибка при удалении расхода:', err);
      throw err;
    }
  };

  // Универсальный метод добавления транзакции
  const addTransaction = async (transactionData) => {
    if (transactionData.type === 'income') {
      return await handleAddIncome(transactionData);
    } else {
      return await handleAddExpense(transactionData);
    }
  };

  // Универсальный метод обновления транзакции
  const updateTransaction = async (id, transactionData) => {
    if (transactionData.type === 'income') {
      return await handleUpdateIncome(id, transactionData);
    } else {
      return await handleUpdateExpense(id, transactionData);
    }
  };

  // Универсальный метод удаления транзакции
  const deleteTransaction = async (id, type) => {
    if (type === 'income') {
      return await handleDeleteIncome(id);
    } else {
      return await handleDeleteExpense(id);
    }
  };

  const value = {
    incomes,
    expenses,
    isLoading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};