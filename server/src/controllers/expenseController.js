import { expenseService } from '../services/expenseService.js';

export const expenseController = {
  /**
   * GET /api/v1/expenses — Получение списка расходов
   */
  async getAll(req, res, next) {
    try {
      const { startDate, endDate, category, page, limit } = req.query;
      const result = expenseService.getAll({ startDate, endDate, category, page, limit });
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/v1/expenses/:id — Получение расхода по ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const expense = expenseService.getById(id);

      if (!expense) {
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: 'Расход с указанным ID не найден',
          },
        });
      }

      res.json(expense);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/v1/expenses — Создание нового расхода
   */
  async create(req, res, next) {
    try {
      const { amount, date, category, comment, isRecurring } = req.body;
      const newExpense = expenseService.create({ amount, date, category, comment, isRecurring });
      res.status(201).json(newExpense);
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/v1/expenses/:id — Обновление расхода
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { amount, date, category, comment, isRecurring } = req.body;

      const updatedExpense = expenseService.update(id, { amount, date, category, comment, isRecurring });

      if (!updatedExpense) {
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: 'Расход с указанным ID не найден',
          },
        });
      }

      res.json(updatedExpense);
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/v1/expenses/:id — Удаление расхода
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const success = expenseService.delete(id);

      if (!success) {
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: 'Расход с указанным ID не найден',
          },
        });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};