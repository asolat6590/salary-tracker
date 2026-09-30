import crypto from 'crypto';
import { getDb } from '../db/connection.js';

/**
 * Получение всех доходов с опциональными фильтрами и пагинацией
 */
export const getAllIncomes = async (options = {}) => {
  const { category, startDate, endDate, page = 1, limit = 20 } = options;
  const db = getDb();

  let result = db.data.incomes;

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
 * Получение дохода по ID
 */
export const getIncomeById = async (id) => {
  const db = getDb();
  return db.data.incomes.find((item) => item.id === id) || null;
};

/**
 * Создание нового дохода
 */
export const createIncome = async (data) => {
  const db = getDb();
  const now = new Date().toISOString();
  
  const newIncome = {
    id: crypto.randomUUID(),
    amount: Number(data.amount),
    date: data.date,
    category: data.category,
    comment: data.comment || '',
    createdAt: now,
    updatedAt: now,
  };

  db.data.incomes.push(newIncome);
  await db.write(); // Сохраняем изменения в файл

  return newIncome;
};

/**
 * Обновление существующего дохода
 */
export const updateIncome = async (id, data) => {
  const db = getDb();
  const index = db.data.incomes.findIndex((item) => item.id === id);
  
  if (index === -1) return null;

  const now = new Date().toISOString();
  const existing = db.data.incomes[index];

  db.data.incomes[index] = {
    ...existing,
    amount: data.amount !== undefined ? Number(data.amount) : existing.amount,
    date: data.date !== undefined ? data.date : existing.date,
    category: data.category !== undefined ? data.category : existing.category,
    comment: data.comment !== undefined ? data.comment : existing.comment,
    updatedAt: now,
  };

  await db.write();
  return db.data.incomes[index];
};

/**
 * Удаление дохода
 */
export const deleteIncome = async (id) => {
  const db = getDb();
  const initialLength = db.data.incomes.length;
  
  db.data.incomes = db.data.incomes.filter((item) => item.id !== id);
  
  if (db.data.incomes.length < initialLength) {
    await db.write();
    return true;
  }
  return false;
};