import * as api from './api';

/**
 * Получение общего баланса (доходы, расходы, разница)
 */
export const getBalance = async (startDate, endDate) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  return await api.get('/summary', params);
};

/**
 * Получение сумм по категориям для круговой диаграммы
 */
export const getByCategory = async (type = 'expense', startDate, endDate) => {
  const params = { type };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  const result = await api.get('/summary/by-category', params);
  
  // Приводим к формату, который ожидают библиотеки графиков (name и value)
  return (result || []).map((item) => ({
    name: item.categoryLabel,
    value: item.total,
    ...item, // сохраняем оригинальные поля для совместимости
  }));
};

/**
 * Получение помесячной сводки для столбчатого графика
 */
export const getMonthlySummary = async (monthsCount = 6) => {
  const result = await api.get('/summary/by-month', { months: monthsCount });
  
  // Приводим к формату с полем name для оси X графика
  return (result || []).map((item) => ({
    name: `${item.year}-${String(item.month).padStart(2, '0')}`,
    income: item.income,
    expense: item.expense,
    ...item, // сохраняем оригинальные поля
  }));
};

/**
 * Получение последних транзакций (доходы + расходы)
 */
export const getRecentTransactions = async (limit = 5) => {
  const [incomesResult, expensesResult] = await Promise.all([
    api.get('/incomes', { limit, page: 1 }),
    api.get('/expenses', { limit, page: 1 }),
  ]);
  
  const incomes = incomesResult.data || [];
  const expenses = expensesResult.data || [];
  
  const incomesWithType = incomes.map((inc) => ({ ...inc, type: 'income' }));
  const expensesWithType = expenses.map((exp) => ({ ...exp, type: 'expense' }));
  
  return [...incomesWithType, ...expensesWithType]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};

/**
 * Получение всех транзакций с фильтрацией
 */
export const getFilteredTransactions = async (filters = {}) => {
  const { type = 'all', category } = filters;
  let transactions = [];
  
  if (type === 'income') {
    const result = await api.get('/incomes', { category: category !== 'all' ? category : undefined });
    transactions = (result.data || []).map((inc) => ({ ...inc, type: 'income' }));
  } else if (type === 'expense') {
    const result = await api.get('/expenses', { category: category !== 'all' ? category : undefined });
    transactions = (result.data || []).map((exp) => ({ ...exp, type: 'expense' }));
  } else {
    const [incomesResult, expensesResult] = await Promise.all([
      api.get('/incomes', { category: category !== 'all' ? category : undefined }),
      api.get('/expenses', { category: category !== 'all' ? category : undefined }),
    ]);
    
    const incomes = (incomesResult.data || []).map((inc) => ({ ...inc, type: 'income' }));
    const expenses = (expensesResult.data || []).map((exp) => ({ ...exp, type: 'expense' }));
    
    transactions = [...incomes, ...expenses];
  }
  
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};