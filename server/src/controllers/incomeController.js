import { incomeService } from '../services/incomeService.js';

export const incomeController = {
  /**
   * GET /api/v1/incomes — Получение списка доходов
   */
  async getAll(req, res, next) {
    try {
      const { startDate, endDate, category, page, limit } = req.query;
      const result = incomeService.getAll({ startDate, endDate, category, page, limit });
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/v1/incomes/:id — Получение дохода по ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const income = incomeService.getById(id);

      if (!income) {
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: 'Доход с указанным ID не найден',
          },
        });
      }

      res.json(income);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/v1/incomes — Создание нового дохода
   */
  async create(req, res, next) {
    try {
      const { amount, date, category, comment } = req.body;
      const newIncome = incomeService.create({ amount, date, category, comment });
      res.status(201).json(newIncome);
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/v1/incomes/:id — Обновление дохода
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { amount, date, category, comment } = req.body;

      const updatedIncome = incomeService.update(id, { amount, date, category, comment });

      if (!updatedIncome) {
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: 'Доход с указанным ID не найден',
          },
        });
      }

      res.json(updatedIncome);
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/v1/incomes/:id — Удаление дохода
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const success = incomeService.delete(id);

      if (!success) {
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: 'Доход с указанным ID не найден',
          },
        });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};