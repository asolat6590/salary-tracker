import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';

// Временный placeholder — на шаге B2 заменим на полноценный App с роутером
const AppPlaceholder = () => (
  <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
    <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '16px' }}>
      Salary Tracker
    </h1>
    <p style={{ color: 'var(--color-text-secondary)' }}>
      Скелет приложения собирается. Глобальные стили применены ✓
    </p>
  </div>
);

const root = document.getElementById('root');

if (!root) {
  console.error('Не найден элемент #root в index.html');
} else {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <AppPlaceholder />
    </React.StrictMode>
  );
}