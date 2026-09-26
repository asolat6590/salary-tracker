import { Router } from 'express';
import { summaryController } from '../controllers/summaryController.js';

const router = Router();

// GET /api/v1/summary — Общий баланс
router.get('/', summaryController.getBalance);

// GET /api/v1/summary/categories — Статистика по категориям
router.get('/categories', summaryController.getByCategory);

// GET /api/v1/summary/monthly — Помесячная аналитика
router.get('/monthly', summaryController.getByMonth);

export default router;