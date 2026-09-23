import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext.jsx';
import Layout from './components/Layout/Layout.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import History from './pages/History/History.jsx';
import Analytics from './pages/Analytics/Analytics.jsx';

function App() {
  return (
    <FinanceProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </FinanceProvider>
  );
}

export default App;