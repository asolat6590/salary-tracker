import { getDb } from '../db/connection.js';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/categories.js';

/**
 * Получение общего баланса (доходы, расходы, разница)
 */
export const getBalance = async (startDate, endDate) => {
  const db = getDb();

  // Фильтрация доходов по датам
  let incomes = db.data.incomes;
  if (startDate) {
    incomes = incomes.filter((item) => item.date >= startDate);
  }
  if (endDate) {
    incomes = incomes.filter((item) => item.date <= endDate);
  }

  // Фильтрация расходов по датам
  let expenses = db.data.expenses;
  if (startDate) {
    expenses = expenses.filter((item) => item.date >= startDate);
  }
  if (endDate) {
    expenses = expenses.filter((item) => item.date <= endDate);
  }

  // Суммируем с помощью reduce
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
};

/**
 * Получение сумм по категориям для круговой диаграммы
 */
export const getByCategory = async (type = 'expense', startDate, endDate) => {
  const db = getDb();
  const items = type === 'income' ? db.data.incomes : db.data.expenses;
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Фильтрация по датам
  let filtered = items;
  if (startDate) {
    filtered = filtered.filter((item) => item.date >= startDate);
  }
  if (endDate) {
    filtered = filtered.filter((item) => item.date <= endDate);
  }

  // Группируем суммы по категориям
  const categorySums = {};
  filtered.forEach((item) => {
    if (!categorySums[item.category]) {
      categorySums[item.category] = 0;
    }
    categorySums[item.category] += item.amount;
  });

  // Маппим в формат ответа, добавляя названия категорий
  return Object.entries(categorySums)
    .map(([categoryId, total]) => {
      const categoryInfo = categories.find((cat) => cat.id === categoryId);
      return {
        categoryId,
        categoryLabel: categoryInfo ? categoryInfo.label : categoryId,
        total,
      };
    })
    .sort((a, b) => b.total - a.total);
};

/**
 * Получение помесячной сводки доходов и расходов
 */
export const getByMonth = async (monthsCount = 6) => {
  const db = getDb();

  // Вычисляем дату начала периода
  const now = new Date();
  const startDateObj = new Date(now.getFullYear(), now.getMonth() - monthsCount + 1, 1);
  const startDateStr = startDateObj.toISOString().split('T')[0];

  // Фильтруем доходы и расходы по начальной дате
  const incomes = db.data.incomes.filter((item) => item.date >= startDateStr);
  const expenses = db.data.expenses.filter((item) => item.date >= startDateStr);

  // Группируем по году и месяцу
  const monthMap = {};

  incomes.forEach((item) => {
    const date = new Date(item.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() возвращает 0-11
    const key = `${year}-${String(month).padStart(2, '0')}`;
    
    if (!monthMap[key]) {
      monthMap[key] = { year, month, income: 0, expense: 0 };
    }
    monthMap[key].income += item.amount;
  });

  expenses.forEach((item) => {
    const date = new Date(item.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const key = `${year}-${String(month).padStart(2, '0')}`;
    
    if (!monthMap[key]) {
      monthMap[key] = { year, month, income: 0, expense: 0 };
    }
    monthMap[key].expense += item.amount;
  });

  // Сортируем по году и месяцу
  return Object.values(monthMap).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });
};