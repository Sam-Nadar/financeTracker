// frontend/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TransactionPage from './pages/TransactionPage';
import Dashboard from './pages/Dashboard';
import BudgetPage from './pages/BudgetPage';
import ChartsPage from './pages/Charts';

export const BASE_URL = import.meta.env.VITE_BASE_URI;

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/transaction" element={<TransactionPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/charts" element={<ChartsPage/>} />

        {/* You can add other routes here */}
        {/* Optionally, a default route */}
        <Route path="*" element={<TransactionPage />} />
      </Routes>
    </Router>
  );
};

export default App;
