import { Router } from 'express';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/categories.js';

const router = Router();

// GET /api/v1/categories — Получение справочника всех категорий
router.get('/', (req, res) => {
  res.json({
    incomes: INCOME_CATEGORIES,
    expenses: EXPENSE_CATEGORIES,
  });
});

export default router;