import crypto from 'crypto';
import { getDb } from '../db/connection.js';

/**
 * Получение всех расходов с опциональными фильтрами и пагинацией
 */
export const getAllExpenses = async (options = {}) => {
  const { category, startDate, endDate, isRecurring, page = 1, limit = 20 } = options;
  const db = getDb();

  let result = db.data.expenses;

  // Фильтрация
  if (category) {
    result = result.filter((item) => item.category === category);
  }
  if (startDate) {
    result = result.filter((item) => item.date >= startDate);
  }
  if (endDate) {
    result = result.filter((item) => item.date <= endDate);
  }
  if (isRecurring !== undefined) {
    result = result.filter((item) => item.isRecurring === isRecurring);
  }

  // Сортировка: новые даты первыми
  result.sort((a, b) => new Date(b.date) - new Date(a.date) || new Date(b.createdAt) - new Date(a.createdAt));

  const total = result.length;
  const offset = (page - 1) * limit;
  const data = result.slice(offset, offset + limit);

  return {
    data,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Получение расхода по ID
 */
export const getExpenseById = async (id) => {
  const db = getDb();
  return db.data.expenses.find((item) => item.id === id) || null;
};

/**
 * Создание нового расхода
 */
export const createExpense = async (data) => {
  const db = getDb();
  const now = new Date().toISOString();
  
  const newExpense = {
    id: crypto.randomUUID(),
    amount: Number(data.amount),
    date: data.date,
    category: data.category,
    comment: data.comment || '',
    isRecurring: Boolean(data.isRecurring),
    createdAt: now,
    updatedAt: now,
  };

  db.data.expenses.push(newExpense);
  await db.write(); // Сохраняем изменения в файл

  return newExpense;
};

/**
 * Обновление существующего расхода
 */
export const updateExpense = async (id, data) => {
  const db = getDb();
  const index = db.data.expenses.findIndex((item) => item.id === id);
  
  if (index === -1) return null;

  const now = new Date().toISOString();
  const existing = db.data.expenses[index];

  db.data.expenses[index] = {
    ...existing,
    amount: data.amount !== undefined ? Number(data.amount) : existing.amount,
    date: data.date !== undefined ? data.date : existing.date,
    category: data.category !== undefined ? data.category : existing.category,
    comment: data.comment !== undefined ? data.comment : existing.comment,
    isRecurring: data.isRecurring !== undefined ? Boolean(data.isRecurring) : existing.isRecurring,
    updatedAt: now,
  };

  await db.write();
  return db.data.expenses[index];
};

/**
 * Удаление расхода
 */
export const deleteExpense = async (id) => {
  const db = getDb();
  const initialLength = db.data.expenses.length;
  
  db.data.expenses = db.data.expenses.filter((item) => item.id !== id);
  
  if (db.data.expenses.length < initialLength) {
    await db.write();
    return true;
  }
  return false;
};