import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Инициализация подключения к базе данных
const db = new Database(config.dbPath);

// Включение WAL-режима для высокой производительности и включение поддержки внешних ключей
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Чтение и выполнение скрипта создания таблиц
const schemaPath = path.resolve(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

export default db;