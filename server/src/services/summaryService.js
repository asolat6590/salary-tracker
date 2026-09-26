import db from '../db/connection.js';

export const summaryService = {
  /**
   * Получение текущего общего баланса (суммарные доходы, расходы и итоговый баланс)
   */
  getBalance() {
    const totalIncomeRow = db.prepare('SELECT SUM(amount) as total FROM incomes').get();
    const totalExpenseRow = db.prepare('SELECT SUM(amount) as total FROM expenses').get();

    const totalIncome = totalIncomeRow.total || 0;
    const totalExpense = totalExpenseRow.total || 0;
    const balance = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      balance,
    };
  },

  /**
   * Получение статистики расходов и доходов по категориям за определенный период
   */
  getByCategory({ startDate, endDate }) {
    let incomeQuery = 'SELECT category, SUM(amount) as total FROM incomes WHERE 1=1';
    let expenseQuery = 'SELECT category, SUM(amount) as total FROM expenses WHERE 1=1';
    const params = [];

    if (startDate) {
      incomeQuery += ' AND date >= ?';
      expenseQuery += ' AND date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      incomeQuery += ' AND date <= ?';
      expenseQuery += ' AND date <= ?';
      params.push(endDate);
    }

    incomeQuery += ' GROUP BY category';
    expenseQuery += ' GROUP BY category';

    const incomesByCategory = db.prepare(incomeQuery).all(...params);
    const expensesByCategory = db.prepare(expenseQuery).all(...params);

    return {
      incomes: incomesByCategory,
      expenses: expensesByCategory,
    };
  },

  /**
   * Помесячная сводка доходов и расходов
   */
  getByMonth() {
    const query = `
      SELECT month, SUM(income) as totalIncome, SUM(expense) as totalExpense FROM (
        SELECT strftime('%Y-%m', date) as month, amount as income, 0 as expense FROM incomes
        UNION ALL
        SELECT strftime('%Y-%m', date) as month, 0 as income, amount as expense FROM expenses
      )
      GROUP BY month
      ORDER BY month DESC
    `;

    const rows = db.prepare(query).all();

    return rows.map((row) => ({
      month: row.month,
      totalIncome: row.totalIncome || 0,
      totalExpense: row.totalExpense || 0,
      netSavings: (row.totalIncome || 0) - (row.totalExpense || 0),
    }));
  },
};