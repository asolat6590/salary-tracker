/**
 * Централизованный обработчик ошибок Middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('[Error Handler]:', err);

  const statusCode = err.status || err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'Внутренняя ошибка сервера';

  res.status(statusCode).json({
    error: {
      code: errorCode,
      message: message,
    },
  });
};