import * as api from './api';

/**
 * Получение всех расходов с опциональными фильтрами и пагинацией
 * @param {Object} filters - Объект фильтров
 * @param {string} filters.category - ID категории
 * @param {string} filters.startDate - Начальная дата (YYYY-MM-DD)
 * @param {string} filters.endDate - Конечная дата (YYYY-MM-DD)
 * @param {boolean} filters.isRecurring - Фильтр по регулярности
 * @param {number} filters.page - Номер страницы (по умолчанию 1)
 * @param {number} filters.limit - Количество записей на странице (по умолчанию 20)
 * @returns {Promise<Object>} Объект { data: [...], pagination: {...} }
 */
export const getExpenses = async (filters = {}) => {
  const params = {};
  
  if (filters.category) params.category = filters.category;
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  if (filters.isRecurring !== undefined) params.isRecurring = filters.isRecurring;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  
  return await api.get('/expenses', params);
};

/**
 * Получение расхода по ID
 * @param {string} id - Идентификатор расхода
 * @returns {Promise<Object>} Объект расхода
 */
export const getExpenseById = async (id) => {
  return await api.get(`/expenses/${id}`);
};

/**
 * Добавление нового расхода
 * @param {Object} expenseData - Данные расхода
 * @param {string} expenseData.category - ID категории
 * @param {number} expenseData.amount - Сумма
 * @param {string} expenseData.date - Дата в формате YYYY-MM-DD
 * @param {string} expenseData.comment - Комментарий
 * @param {boolean} expenseData.isRecurring - Признак регулярного расхода
 * @returns {Promise<Object>} Созданный объект расхода
 */
export const addExpense = async (expenseData) => {
  return await api.post('/expenses', expenseData);
};

/**
 * Обновление существующего расхода
 * @param {string} id - Идентификатор расхода
 * @param {Object} expenseData - Новые данные
 * @returns {Promise<Object>} Обновлённый объект расхода
 */
export const updateExpense = async (id, expenseData) => {
  return await api.put(`/expenses/${id}`, expenseData);
};

/**
 * Удаление расхода
 * @param {string} id - Идентификатор расхода
 * @returns {Promise<void>}
 */
export const deleteExpense = async (id) => {
  await api.del(`/expenses/${id}`);
};

/**
 * Удаление всех расходов (если нужно)
 * @returns {Promise<void>}
 */
export const clearAllExpenses = async () => {
  // На backend нет массового удаления, поэтому удаляем по одному
  const { data } = await getExpenses();
  for (const expense of data) {
    await deleteExpense(expense.id);
  }
};