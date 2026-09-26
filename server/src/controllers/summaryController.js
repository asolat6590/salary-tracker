import { summaryService } from '../services/summaryService.js';

export const summaryController = {
  /**
   * GET /api/v1/summary — Общий баланс (доходы, расходы, итого)
   */
  async getBalance(req, res, next) {
    try {
      const summary = summaryService.getBalance();
      res.json(summary);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/v1/summary/categories — Распределение по категориям
   */
  async getByCategory(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const categoriesSummary = summaryService.getByCategory({ startDate, endDate });
      res.json(categoriesSummary);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/v1/summary/monthly — Сводка по месяцах
   */
  async getByMonth(req, res, next) {
    try {
      const monthlySummary = summaryService.getByMonth();
      res.json(monthlySummary);
    } catch (error) {
      next(error);
    }
  },
};