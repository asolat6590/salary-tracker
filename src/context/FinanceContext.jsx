import React, { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext();

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance должен использоваться внутри FinanceProvider');
  }
  return context;
};

export const FinanceProvider = ({ children }) => {
  // Загрузка начальных данных из localStorage или установка значений по умолчанию
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('salary_tracker_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('salary_tracker_categories');
    return saved
      ? JSON.parse(saved)
      : ['Продукты', 'Транспорт', 'Жилье', 'Развлечения', 'Зарплата', 'Другое'];
  });

  // Сохранение операций при их изменении
  useEffect(() => {
    localStorage.setItem('salary_tracker_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Сохранение категорий при их изменении
  useEffect(() => {
    localStorage.setItem('salary_tracker_categories', JSON.stringify(categories));
  }, [categories]);

  // Добавление новой операции
  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...transaction,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  // Удаление операции
  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
  };

  // Добавление новой категории
  const addCategory = (category) => {
    if (category && !categories.includes(category)) {
      setCategories((prev) => [...prev, category]);
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        addTransaction,
        deleteTransaction,
        addCategory,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};