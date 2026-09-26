import { Router } from 'express';
import { incomeController } from '../controllers/incomeController.js';
import { validateIncome } from '../middleware/validate.js';

const router = Router();

// GET /api/v1/incomes — Получение списка доходов
router.get('/', incomeController.getAll);

// GET /api/v1/incomes/:id — Получение дохода по ID
router.get('/:id', incomeController.getById);

// POST /api/v1/incomes — Создание нового дохода
router.post('/', validateIncome, incomeController.create);

// PUT /api/v1/incomes/:id — Обновление дохода
router.put('/:id', validateIncome, incomeController.update);

// DELETE /api/v1/incomes/:id — Удаление дохода
router.delete('/:id', incomeController.delete);

export default router;