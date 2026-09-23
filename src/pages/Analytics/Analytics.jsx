import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext.jsx';
import styles from './Analytics.module.css';

function Analytics() {
  const { transactions } = useFinance();
  const [period, setPeriod] = useState('all');

  // Расчет расходов по категориям
  const categoryTotals = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const totalExpense = Object.values(categoryTotals).reduce(
    (acc, val) => acc + val,
    0
  );

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className={styles.analyticsContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Аналитика</h1>
        <div className={styles.controls}>
          <select
            className={styles.periodSelect}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="all">За всё время</option>
          </select>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Сводка доходов и расходов</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <div>
              <strong>Общий доход: </strong>
              <span style={{ color: '#10b981' }}>+{income.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div>
              <strong>Общий расход: </strong>
              <span style={{ color: '#ef4444' }}>-{totalExpense.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div>
              <strong>Сбережения: </strong>
              <span>{(income - totalExpense).toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Структура расходов</h2>
          {Object.keys(categoryTotals).length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)' }}>Расходов пока нет</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {Object.entries(categoryTotals).map(([cat, amount]) => {
                const percentage = totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(1) : 0;
                return (
                  <div key={cat} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{cat}</span>
                    <span>
                      {amount.toLocaleString('ru-RU')} ₽ ({percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;