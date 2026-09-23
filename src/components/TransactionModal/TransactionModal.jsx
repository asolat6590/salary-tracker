import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext.jsx';
import styles from './TransactionModal.module.css';

function TransactionModal({ isOpen, onClose }) {
  const { categories, addTransaction } = useFinance();
  
  const [type, setType] = useState('expense'); // 'expense' или 'income'
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0] || '');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    addTransaction({
      type,
      amount: parseFloat(amount),
      category: type === 'income' ? 'Доход' : category,
      description,
    });

    // Сброс формы и закрытие
    setAmount('');
    setDescription('');
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Новая операция</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.typeToggle}>
            <button
              type="button"
              className={`${styles.typeBtn} ${type === 'expense' ? styles.typeBtnActiveExpense : ''}`}
              onClick={() => setType('expense')}
            >
              Расход
            </button>
            <button
              type="button"
              className={`${styles.typeBtn} ${type === 'income' ? styles.typeBtnActiveIncome : ''}`}
              onClick={() => setType('income')}
            >
              Доход
            </button>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Сумма (₽)</label>
            <input
              type="number"
              className={styles.input}
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0.01"
              step="any"
            />
          </div>

          {type === 'expense' && (
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Категория</label>
              <select
                className={styles.select}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Описание</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Например: Покупка продуктов"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Добавить
          </button>
        </form>
      </div>
    </div>
  );
}

export default TransactionModal;