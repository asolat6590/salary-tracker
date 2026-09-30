import * as api from './api';

/**
 * Получение общего баланса (доходы, расходы, разница)
 * @param {string} startDate - Начальная дата фильтра (опционально, YYYY-MM-DD)
 * @param {string} endDate - Конечная дата фильтра (опционально, YYYY-MM-DD)
 * @returns {Promise<Object>} Объект { totalIncome, totalExpense, balance }
 */
export const getBalance = async (startDate, endDate) => {
  const params = {};
  
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  return await api.get('/summary', params);
};

/**
 * Получение сумм по категориям для круговой диаграммы
 * @param {string} type - Тип операции ('income' или 'expense')
 * @param {string} startDate - Начальная дата фильтра (опционально, YYYY-MM-DD)
 * @param {string} endDate - Конечная дата фильтра (опционально, YYYY-MM-DD)
 * @returns {Promise<Array>} Массив объектов [{ categoryId, categoryLabel, total }]
 */
export const getByCategory = async (type = 'expense', startDate, endDate) => {
  const params = { type };
  
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  return await api.get('/summary/by-category', params);
};

/**
 * Получение помесячной сводки для столбчатого графика
 * @param {number} monthsCount - Количество месяцев для отображения (по умолчанию 6)
 * @returns {Promise<Array>} Массив объектов [{ year, month, income, expense }]
 */
export const getMonthlySummary = async (monthsCount = 6) => {
  return await api.get('/summary/by-month', { months: monthsCount });
};

/**
 * Получение последних транзакций (доходы + расходы)
 * @param {number} limit - Количество транзакций (по умолчанию 5)
 * @returns {Promise<Array>} Массив последних транзакций
 */
export const getRecentTransactions = async (limit = 5) => {
  // Получаем последние доходы и расходы отдельно, затем объединяем
  const [incomesResult, expensesResult] = await Promise.all([
    api.get('/incomes', { limit, page: 1 }),
    api.get('/expenses', { limit, page: 1 }),
  ]);
  
  const incomes = incomesResult.data || [];
  const expenses = expensesResult.data || [];
  
  // Добавляем поле type для различения
  const incomesWithType = incomes.map((inc) => ({ ...inc, type: 'income' }));
  const expensesWithType = expenses.map((exp) => ({ ...exp, type: 'expense' }));
  
  // Объединяем и сортируем по дате (новые первые)
  return [...incomesWithType, ...expensesWithType]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};

/**
 * Получение всех транзакций с фильтрацией
 * @param {Object} filters - Объект фильтров
 * @param {string} filters.type - Тип операции ('all', 'income', 'expense')
 * @param {string} filters.category - ID категории ('all' или конкретный ID)
 * @returns {Promise<Array>} Отфильтрованный массив транзакций
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
    // Получаем и доходы, и расходы параллельно
    const [incomesResult, expensesResult] = await Promise.all([
      api.get('/incomes', { category: category !== 'all' ? category : undefined }),
      api.get('/expenses', { category: category !== 'all' ? category : undefined }),
    ]);
    
    const incomes = (incomesResult.data || []).map((inc) => ({ ...inc, type: 'income' }));
    const expenses = (expensesResult.data || []).map((exp) => ({ ...exp, type: 'expense' }));
    
    transactions = [...incomes, ...expenses];
  }
  
  // Сортировка по дате (новые первые)
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};