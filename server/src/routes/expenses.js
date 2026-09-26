import { Router } from 'express';
import { expenseController } from '../controllers/expenseController.js';
import { validateExpense } from '../middleware/validate.js';

const router = Router();

// GET /api/v1/expenses — Получение списка расходов
router.get('/', expenseController.getAll);

// GET /api/v1/expenses/:id — Получение расхода по ID
router.get('/:id', expenseController.getById);

// POST /api/v1/expenses — Создание нового расхода
router.post('/', validateExpense, expenseController.create);

// PUT /api/v1/expenses/:id — Обновление расхода
router.put('/:id', validateExpense, expenseController.update);

// DELETE /api/v1/expenses/:id — Удаление расхода
router.delete('/:id', expenseController.delete);

export default router;