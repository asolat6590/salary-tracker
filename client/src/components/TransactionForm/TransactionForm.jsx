import React, { useState, useEffect } from 'react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/constants';
import styles from './TransactionForm.module.css';

function TransactionForm({ onSubmit, onCancel, editData, isSubmitting = false }) {
  const [type, setType] = useState(editData?.type || 'income');
  const [amount, setAmount] = useState(editData?.amount || '');
  const [date, setDate] = useState(editData?.date || new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState(editData?.category || '');
  const [comment, setComment] = useState(editData?.comment || '');

  // Обновляем форму при изменении editData
  useEffect(() => {
    if (editData) {
      setType(editData.type || 'income');
      setAmount(editData.amount || '');
      setDate(editData.date || new Date().toISOString().split('T')[0]);
      setCategory(editData.category || '');
      setComment(editData.comment || '');
    }
  }, [editData]);

  // Получаем категории в зависимости от типа
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Обработчик изменения типа
  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(''); // Сбрасываем категорию при смене типа
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Валидация
    if (!amount || !date || !category) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (Number(amount) <= 0) {
      alert('Сумма должна быть больше 0');
      return;
    }

    const transactionData = {
      type,
      amount: Number(amount),
      date,
      category,
      comment,
    };

    onSubmit(transactionData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Переключатель типа */}
      <div className={styles.typeSelector}>
        <button
          type="button"
          className={`${styles.typeButton} ${type === 'income' ? styles.typeButtonActiveIncome : ''}`}
          onClick={() => handleTypeChange('income')}
          disabled={isSubmitting}
        >
          Доход
        </button>
        <button
          type="button"
          className={`${styles.typeButton} ${type === 'expense' ? styles.typeButtonActiveExpense : ''}`}
          onClick={() => handleTypeChange('expense')}
          disabled={isSubmitting}
        >
          Расход
        </button>
      </div>

      {/* Сумма */}
      <div className={styles.field}>
        <label className={styles.label}>Сумма *</label>
        <input
          type="number"
          className={styles.input}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Введите сумму"
          min="0"
          step="0.01"
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Дата */}
      <div className={styles.field}>
        <label className={styles.label}>Дата *</label>
        <input
          type="date"
          className={styles.input}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Категория */}
      <div className={styles.field}>
        <label className={styles.label}>Категория *</label>
        <select
          className={styles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          disabled={isSubmitting}
        >
          <option value="">Выберите категорию</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Комментарий */}
      <div className={styles.field}>
        <label className={styles.label}>Комментарий</label>
        <textarea
          className={styles.textarea}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Необязательный комментарий"
          rows="3"
          disabled={isSubmitting}
        />
      </div>

      {/* Кнопки */}
      <div className={styles.buttons}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Отмена
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Сохранение...' : editData ? 'Обновить' : 'Добавить'}
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;