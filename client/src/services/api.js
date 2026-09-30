// Базовый URL API из переменных окружения Vite
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Преобразование объекта параметров в query-строку
 * @param {Object} params - Объект с параметрами
 * @returns {string} Query-строка (например, "?page=1&limit=20")
 */
const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) return '';
  
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  
  return queryString ? `?${queryString}` : '';
};

/**
 * Основная функция для выполнения HTTP-запросов
 * @param {string} path - Путь эндпоинта (например, "/incomes")
 * @param {Object} options - Опции запроса
 * @param {string} options.method - HTTP-метод (GET, POST, PUT, DELETE)
 * @param {Object} options.body - Тело запроса (будет сериализовано в JSON)
 * @param {Object} options.params - Query-параметры
 * @returns {Promise<any>} Данные из ответа
 */
const request = async (path, options = {}) => {
  const { method = 'GET', body, params } = options;
  
  const url = `${BASE_URL}/api/v1${path}${buildQueryString(params)}`;
  
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (body && (method === 'POST' || method === 'PUT')) {
    config.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, config);
    
    // Парсим JSON-ответ
    const data = await response.json();
    
    // Если HTTP-статус не успешный (4xx, 5xx)
    if (!response.ok) {
      // Если бэкенд вернул ошибку в формате { error: { code, message } }
      if (data.error) {
        const error = new Error(data.error.message || 'Ошибка сервера');
        error.code = data.error.code || 'UNKNOWN_ERROR';
        error.status = response.status;
        throw error;
      }
      
      // Если формат ошибки другой
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Успешный ответ
    // Если есть поле data — возвращаем его (может быть объект или массив)
    if ('data' in data) {
      // Если есть pagination — добавляем его к data
      if (data.pagination) {
        return {
          data: data.data,
          pagination: data.pagination,
        };
      }
      return data.data;
    }
    
    // Если нет поля data — возвращаем весь ответ
    return data;
    
  } catch (error) {
    // Ошибки сети (нет подключения, CORS, таймаут)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const networkError = new Error('Не удалось подключиться к серверу. Проверьте подключение к интернету.');
      networkError.code = 'NETWORK_ERROR';
      throw networkError;
    }
    
    // Пробрасываем остальные ошибки дальше
    throw error;
  }
};

/**
 * GET-запрос
 * @param {string} path - Путь эндпоинта
 * @param {Object} params - Query-параметры
 * @returns {Promise<any>} Данные из ответа
 */
export const get = (path, params) => {
  return request(path, { method: 'GET', params });
};

/**
 * POST-запрос
 * @param {string} path - Путь эндпоинта
 * @param {Object} body - Тело запроса
 * @returns {Promise<any>} Данные из ответа
 */
export const post = (path, body) => {
  return request(path, { method: 'POST', body });
};

/**
 * PUT-запрос
 * @param {string} path - Путь эндпоинта
 * @param {Object} body - Тело запроса
 * @returns {Promise<any>} Данные из ответа
 */
export const put = (path, body) => {
  return request(path, { method: 'PUT', body });
};

/**
 * DELETE-запрос
 * @param {string} path - Путь эндпоинта
 * @returns {Promise<any>} Данные из ответа
 */
export const del = (path) => {
  return request(path, { method: 'DELETE' });
};