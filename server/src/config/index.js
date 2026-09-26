import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  port: process.env.PORT || 3001,
  corsOptions: {
    origin: '*', // Разрешить запросы с любого источника (в продакшене лучше ограничить до домена фронтенда)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  dbPath: path.resolve(__dirname, '../../database.sqlite'),
};