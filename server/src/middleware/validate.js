import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/categories.js';

// Валидация формата даты YYYY-MM-DD
const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  const d = new Date(dateString);
  return d instanceof Date && !isNaN(d) && d.toISOString().slice(0, 10) === dateString;
};

/**
 * Валидация данных для создания/обновления доходов
 */
export const validateIncome = (req, res, next) => {
  const { amount, date, category } = req.body;
  const errors = [];

  if (amount === undefined || typeof amount !== 'number' || amount <= 0) {
    errors.push('Сумма (amount) должна быть положительным числом.');
  }

  if (!date || !isValidDate(date)) {
    errors.push('Дата (date) должна быть в формате YYYY-MM-DD.');
  }

  const validCategories = INCOME_CATEGORIES.map((c) => c.id);
  if (!category || !validCategories.includes(category)) {
    errors.push(`Некорректная категория дохода (category). Допустимые значения: ${validCategories.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: errors.join(' '),
      },
    });
  }

  next();
};

/**
 * Валидация данных для создания/обновления расходов
 */
export const validateExpense = (req, res, next) => {
  const { amount, date, category } = req.body;
  const errors = [];

  if (amount === undefined || typeof amount !== 'number' || amount <= 0) {
    errors.push('Сумма (amount) должна быть положительным числом.');
  }

  if (!date || !isValidDate(date)) {
    errors.push('Дата (date) должна быть в формате YYYY-MM-DD.');
  }

  const validCategories = EXPENSE_CATEGORIES.map((c) => c.id);
  if (!category || !validCategories.includes(category)) {
    errors.push(`Некорректная категория расхода (category). Допустимые значения: ${validCategories.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: errors.join(' '),
      },
    });
  }

  next();
};