import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';

import incomeRoutes from './routes/incomes.js';
import expenseRoutes from './routes/expenses.js';
import summaryRoutes from './routes/summary.js';
import categoriesRoutes from './routes/categories.js';

const app = express();

// Middlewares
app.use(cors(config.corsOptions));
app.use(express.json());

// Маршруты API
app.use('/api/v1/incomes', incomeRoutes);
app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1/summary', summaryRoutes);
app.use('/api/v1/categories', categoriesRoutes);

// Проверка работоспособности (Health check)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Глобальный обработчик ошибок (должен быть подключен последним)
app.use(errorHandler);

// Запуск сервера
app.listen(config.port, () => {
  console.log(`🚀 Сервер запущен на порту ${config.port}`);
  console.log(`База данных подключена.`);
});