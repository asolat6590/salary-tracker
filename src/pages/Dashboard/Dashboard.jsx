import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext.jsx';
import TransactionModal from '../../components/TransactionModal/TransactionModal.jsx';
import styles from './Dashboard.module.css';

function Dashboard() {
  const { transactions } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Расчет общих сумм
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  // Последние 5 операций
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Обзор финансов</h1>
        <button
          className={styles.addBtn}
          onClick={() => setIsModalOpen(true)}
        >
          + Добавить операцию
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Текущий баланс</span>
          <span className={styles.statValue}>{balance.toLocaleString('ru-RU')} ₽</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Доходы</span>
          <span className={`${styles.statValue} ${styles.income}`}>
            +{income.toLocaleString('ru-RU')} ₽
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Расходы</span>
          <span className={`${styles.statValue} ${styles.expense}`}>
            -{expense.toLocaleString('ru-RU')} ₽
          </span>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Последние операции</h2>
        {recentTransactions.length === 0 ? (
          <p className={styles.emptyText}>Операций пока нет</p>
        ) : (
          <div className={styles.transactionList}>
            {recentTransactions.map((item) => (
              <div key={item.id} className={styles.transactionItem}>
                <div>
                  <div className={styles.transactionCategory}>{item.category}</div>
                  <div className={styles.transactionDesc}>
                    {item.description || item.date}
                  </div>
                </div>
                <div
                  className={
                    item.type === 'income' ? styles.income : styles.expense
                  }
                >
                  {item.type === 'income' ? '+' : '-'}
                  {item.amount.toLocaleString('ru-RU')} ₽
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default Dashboard;