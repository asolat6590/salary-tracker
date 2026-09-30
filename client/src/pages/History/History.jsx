import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/constants';
import TransactionList from '../../components/TransactionList/TransactionList';
import Modal from '../../components/Modal/Modal';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import styles from './History.module.css';

function History() {
  const { incomes, expenses, addTransaction, updateTransaction, deleteTransaction } = useData();
  
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Все транзакции
  const allTransactions = useMemo(() => {
    const incomesWithType = (incomes || []).map((inc) => ({ ...inc, type: 'income' }));
    const expensesWithType = (expenses || []).map((exp) => ({ ...exp, type: 'expense' }));
    return [...incomesWithType, ...expensesWithType];
  }, [incomes, expenses]);

  // Отфильтрованные транзакции
  const filteredTransactions = useMemo(() => {
    let result = allTransactions;

    // Фильтрация по типу
    if (typeFilter !== 'all') {
      result = result.filter((t) => t.type === typeFilter);
    }

    // Фильтрация по категории
    if (categoryFilter !== 'all') {
      result = result.filter((t) => t.category === categoryFilter);
    }

    // Сортировка по дате (новые первые)
    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [allTransactions, typeFilter, categoryFilter]);

  // Категории для фильтра (объединяем все категории)
  const allCategories = useMemo(() => {
    return [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
  }, []);

  // Обработчики модалки
  const handleOpenModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(false);
  };

  // Обработчик редактирования
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  // Обработчик отправки формы
  const handleSubmit = async (transactionData) => {
    try {
      setIsSubmitting(true);
      
      if (editingTransaction) {
        // Режим редактирования
        await updateTransaction(editingTransaction.id, {
          ...transactionData,
          type: editingTransaction.type,
        });
      } else {
        // Режим добавления
        await addTransaction(transactionData);
      }
      
      handleCloseModal();
    } catch (err) {
      console.error('Ошибка при сохранении транзакции:', err);
      alert(`Ошибка: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Обработчик удаления
  const handleDelete = async (id) => {
    const transaction = allTransactions.find((t) => t.id === id);
    if (transaction) {
      if (window.confirm('Вы уверены, что хотите удалить эту операцию?')) {
        try {
          await deleteTransaction(id, transaction.type);
        } catch (err) {
          console.error('Ошибка при удалении транзакции:', err);
          alert(`Ошибка: ${err.message}`);
        }
      }
    }
  };

  return (
    <div className={styles.history}>
      <div className={styles.header}>
        <h1 className={styles.title}>История операций</h1>
        <button className={styles.addButton} onClick={handleOpenModal}>
          <span className={styles.addIcon}>+</span>
          Добавить операцию
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Тип операции</label>
          <select
            className={styles.filterSelect}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">Все</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Категория</label>
          <select
            className={styles.filterSelect}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Все категории</option>
            {(allCategories || []).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.listContainer}>
        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTransaction ? 'Редактировать операцию' : 'Добавить операцию'}
      >
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          editData={editingTransaction}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}

export default History;