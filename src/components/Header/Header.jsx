import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const location = useLocation();
  
  const navLinks = [
    { path: '/', label: 'Главная' },
    { path: '/history', label: 'История' },
    { path: '/analytics', label: 'Аналитика' },
  ];
  
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          💰 Salary Tracker
        </Link>
        
        <nav className={styles.nav}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;