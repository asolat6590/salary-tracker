import db from '../db/connection.js';

// Вспомогательная функция для преобразования полей из snake_case в camelCase
const mapExpenseFromDb = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    amount: row.amount,
    date: row.date,
    category: row.category,
    comment: row.comment,
    isRecurring: Boolean(row.is_recurring),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export const expenseService = {
  /**
   * Получение списка расходов с фильтрацией и пагинацией
   */
  getAll({ startDate, endDate, category, page = 1, limit = 20 }) {
    let query = 'SELECT * FROM expenses WHERE 1=1';
    const params = [];

    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    // Подсчет общего количества записей для пагинации
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const totalRow = db.prepare(countQuery).get(...params);
    const total = totalRow ? totalRow.total : 0;

    // Добавление сортировки и пагинации
    const offset = (page - 1) * limit;
    query += ' ORDER BY date DESC, created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const rows = db.prepare(query).all(...params);

    return {
      data: rows.map(mapExpenseFromDb),
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  },

  /**
   * Получение расхода по ID
   */
  getById(id) {
    const row = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
    return mapExpenseFromDb(row);
  },

  /**
   * Создание нового расхода
   */
  create({ amount, date, category, comment = '', isRecurring = false }) {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO expenses (id, amount, date, category, comment, is_recurring, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, amount, date, category, comment, isRecurring ? 1 : 0, now, now);

    return this.getById(id);
  },

  /**
   * Обновление существующего расхода
   */
  update(id, { amount, date, category, comment, isRecurring }) {
    const existing = this.getById(id);
    if (!existing) return null;

    const updatedAmount = amount !== undefined ? amount : existing.amount;
    const updatedDate = date !== undefined ? date : existing.date;
    const updatedCategory = category !== undefined ? category : existing.category;
    const updatedComment = comment !== undefined ? comment : existing.comment;
    const updatedIsRecurring = isRecurring !== undefined ? (isRecurring ? 1 : 0) : (existing.isRecurring ? 1 : 0);
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      UPDATE expenses
      SET amount = ?, date = ?, category = ?, comment = ?, is_recurring = ?, updated_at = ?
      WHERE id = ?
    `);

    stmt.run(updatedAmount, updatedDate, updatedCategory, updatedComment, updatedIsRecurring, now, id);

    return this.getById(id);
  },

  /**
   * Удаление расхода
   */
  delete(id) {
    const result = db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
    return result.changes > 0;
  },
};