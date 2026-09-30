import React, { useState, useEffect, useMemo } from 'react';
import { getByCategory, getMonthlySummary, getBalance } from '../../services/summaryService';
import { formatAmount } from '../../utils/formatters';
import PieChart from '../../components/PieChart/PieChart';
import BarChart from '../../components/BarChart/BarChart';
import styles from './Analytics.module.css';

function Analytics() {
  const [period, setPeriod] = useState('month');
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [balanceData, setBalanceData] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const periods = [
    { id: 'week', label: 'Неделя' },
    { id: 'month', label: 'Месяц' },
    { id: 'quarter', label: 'Квартал' },
    { id: 'year', label: 'Год' },
  ];

  // Определяем количество месяцев для графика в зависимости от периода
  const monthsCount = useMemo(() => {
    switch (period) {
      case 'week':
        return 1;
      case 'month':
        return 1;
      case 'quarter':
        return 3;
      case 'year':
        return 12;
      default:
        return 6;
    }
  }, [period]);

  // Загрузка данных при монтировании и изменении периода
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Загружаем все данные параллельно
        const [categoryResult, monthlyResult, balanceResult] = await Promise.all([
          getByCategory('expense'),
          getMonthlySummary(monthsCount),
          getBalance(),
        ]);
        
        setCategoryData(categoryResult || []);
        setMonthlyData(monthlyResult || []);
        setBalanceData(balanceResult || { totalIncome: 0, totalExpense: 0, balance: 0 });
      } catch (err) {
        console.error('Ошибка при загрузке аналитики:', err);
        alert(`Ошибка при загрузке данных: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [monthsCount]);

  return (
    <div className={styles.analytics}>
      <div className={styles.header}>
        <h1 className={styles.title}>Аналитика</h1>
      </div>

      <div className={styles.periodSelector}>
        {periods.map((p) => (
          <button
            key={p.id}
            className={`${styles.periodButton} ${
              period === p.id ? styles.periodButtonActive : ''
            }`}
            onClick={() => setPeriod(p.id)}
            disabled={isLoading}
          >
            {p.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className={styles.loading}>Загрузка данных...</div>
      ) : (
        <>
          <div className={styles.chartsGrid}>
            <div className={styles.chartCard}>
              <h2 className={styles.chartTitle}>Расходы по категориям</h2>
              <div className={styles.chartContainer}>
                {categoryData.length > 0 ? (
                  <PieChart data={categoryData} />
                ) : (
                  <div className={styles.emptyChart}>Нет данных для отображения</div>
                )}
              </div>
            </div>

            <div className={styles.chartCard}>
              <h2 className={styles.chartTitle}>Доходы и расходы по месяцам</h2>
              <div className={styles.chartContainer}>
                {monthlyData.length > 0 ? (
                  <BarChart data={monthlyData} />
                ) : (
                  <div className={styles.emptyChart}>Нет данных для отображения</div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.summarySection}>
            <h2 className={styles.summaryTitle}>Сводка за период</h2>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Общие доходы</span>
                <span className={`${styles.summaryValue} ${styles.summaryValueIncome}`}>
                  {formatAmount(balanceData.totalIncome)}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Общие расходы</span>
                <span className={`${styles.summaryValue} ${styles.summaryValueExpense}`}>
                  {formatAmount(balanceData.totalExpense)}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Баланс</span>
                <span className={`${styles.summaryValue} ${styles.summaryValueBalance}`}>
                  {formatAmount(balanceData.balance)}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;