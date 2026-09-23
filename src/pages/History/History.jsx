import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext.jsx';
import TransactionModal from '../../components/TransactionModal/TransactionModal.jsx';
import styles from './History.module.css';

function History() {
  const { transactions, deleteTransaction } = useFinance();
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Фильтрация списка операций
  const filteredTransactions = transactions.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div className={styles.historyContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>История операций</h1>
        <div className={styles.filters}>
          <select
            className={styles.filterSelect}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Все операции</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
          </select>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Операции не найдены</p>
        </div>
      ) : (
        <div className={styles.transactionList}>
          {filteredTransactions.map((item) => (
            <div key={item.id} className={styles.transactionCard}>
              <div className={styles.transactionInfo}>
                <span className={styles.category}>{item.category}</span>
                <span className={styles.description}>
                  {item.description || item.date}
                </span>
              </div>
              <div className={styles.rightContent}>
                <span
                  className={
                    item.type === 'income' ? styles.income : styles.expense
                  }
                >
                  {item.type === 'income' ? '+' : '-'}
                  {item.amount.toLocaleString('ru-RU')} ₽
                </span>
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteTransaction(item.id)}
                  title="Удалить"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className={styles.fab}
        onClick={() => setIsModalOpen(true)}
        title="Добавить операцию"
      >
        +
      </button>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default History;