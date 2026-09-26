import db from '../db/connection.js';

// Вспомогательная функция для преобразования полей из snake_case в camelCase
const mapIncomeFromDb = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    amount: row.amount,
    date: row.date,
    category: row.category,
    comment: row.comment,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export const incomeService = {
  /**
   * Получение списка доходов с фильтрацией и пагинацией
   */
  getAll({ startDate, endDate, category, page = 1, limit = 20 }) {
    let query = 'SELECT * FROM incomes WHERE 1=1';
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
      data: rows.map(mapIncomeFromDb),
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  },

  /**
   * Получение дохода по ID
   */
  getById(id) {
    const row = db.prepare('SELECT * FROM incomes WHERE id = ?').get(id);
    return mapIncomeFromDb(row);
  },

  /**
   * Создание нового дохода
   */
  create({ amount, date, category, comment = '' }) {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO incomes (id, amount, date, category, comment, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, amount, date, category, comment, now, now);

    return this.getById(id);
  },

  /**
   * Обновление существующего дохода
   */
  update(id, { amount, date, category, comment }) {
    const existing = this.getById(id);
    if (!existing) return null;

    const updatedAmount = amount !== undefined ? amount : existing.amount;
    const updatedDate = date !== undefined ? date : existing.date;
    const updatedCategory = category !== undefined ? category : existing.category;
    const updatedComment = comment !== undefined ? comment : existing.comment;
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      UPDATE incomes
      SET amount = ?, date = ?, category = ?, comment = ?, updated_at = ?
      WHERE id = ?
    `);

    stmt.run(updatedAmount, updatedDate, updatedCategory, updatedComment, now, id);

    return this.getById(id);
  },

  /**
   * Удаление дохода
   */
  delete(id) {
    const result = db.prepare('DELETE FROM incomes WHERE id = ?').run(id);
    return result.changes > 0;
  },
};