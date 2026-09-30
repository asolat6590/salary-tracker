import * as api from './api';

/**
 * Получение всех доходов с опциональными фильтрами и пагинацией
 * @param {Object} filters - Объект фильтров
 * @param {string} filters.category - ID категории
 * @param {string} filters.startDate - Начальная дата (YYYY-MM-DD)
 * @param {string} filters.endDate - Конечная дата (YYYY-MM-DD)
 * @param {number} filters.page - Номер страницы (по умолчанию 1)
 * @param {number} filters.limit - Количество записей на странице (по умолчанию 20)
 * @returns {Promise<Object>} Объект { data: [...], pagination: {...} }
 */
export const getIncomes = async (filters = {}) => {
  const params = {};
  
  if (filters.category) params.category = filters.category;
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  
  return await api.get('/incomes', params);
};

/**
 * Получение дохода по ID
 * @param {string} id - Идентификатор дохода
 * @returns {Promise<Object>} Объект дохода
 */
export const getIncomeById = async (id) => {
  return await api.get(`/incomes/${id}`);
};

/**
 * Добавление нового дохода
 * @param {Object} incomeData - Данные дохода
 * @param {string} incomeData.category - ID категории
 * @param {number} incomeData.amount - Сумма
 * @param {string} incomeData.date - Дата в формате YYYY-MM-DD
 * @param {string} incomeData.comment - Комментарий
 * @returns {Promise<Object>} Созданный объект дохода
 */
export const addIncome = async (incomeData) => {
  return await api.post('/incomes', incomeData);
};

/**
 * Обновление существующего дохода
 * @param {string} id - Идентификатор дохода
 * @param {Object} incomeData - Новые данные
 * @returns {Promise<Object>} Обновлённый объект дохода
 */
export const updateIncome = async (id, incomeData) => {
  return await api.put(`/incomes/${id}`, incomeData);
};

/**
 * Удаление дохода
 * @param {string} id - Идентификатор дохода
 * @returns {Promise<void>}
 */
export const deleteIncome = async (id) => {
  await api.del(`/incomes/${id}`);
};

/**
 * Удаление всех доходов (если нужно)
 * @returns {Promise<void>}
 */
export const clearAllIncomes = async () => {
  // На backend нет массового удаления, поэтому удаляем по одному
  const { data } = await getIncomes();
  for (const income of data) {
    await deleteIncome(income.id);
  }
};