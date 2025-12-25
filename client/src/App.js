import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';

// Context & Hooks
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import { useFinanceData } from './hooks/useFinanceData';

// Layout
import Navbar from './components/layout/Navbar';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';

// Pages
import Profile from './pages/Profile';
import VerifyEmail from './pages/VerifyEmail';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';

// Dashboard Components
import SummaryCards from './components/dashboard/SummaryCards';
import BudgetInput from './components/dashboard/BudgetInput';
import Filters from './components/dashboard/Filters';
import SearchBar from './components/common/SearchBar';
import SummaryTrendsChart from './components/dashboard/SummaryTrendsChart';
import TopCategories from './components/dashboard/TopCategories';
import BudgetProgressBar from './components/dashboard/BudgetProgressBar';
import DatePeriodSelector from './components/dashboard/DatePeriodSelector';

// Expense Components
import ExpenseForm from './components/expenses/ExpenseForm';
import ExpenseList from './components/expenses/ExpenseList';
import ExpenseChart from './components/expenses/ExpenseChart';
import ExpenseBarChart from './components/expenses/ExpenseBarChart';
import ExportSection from './components/expenses/ExportSection';

// Income Components
import IncomeForm from './components/income/IncomeForm';
import IncomeList from './components/income/IncomeList';
import IncomeChart from './components/income/IncomeChart';
import IncomeBarChart from './components/income/IncomeBarChart';
import ExportIncomeSection from './components/income/ExportIncomeSection';


function ResetPasswordWrapper() {
  const { token } = useParams();
  return <ResetPassword token={token} />;
}

function AppContent() {
  const { user } = useAuth();
  const {
    expenses, incomes, budget,
    addExpense, deleteExpense, updateExpense,
    addIncome, deleteIncome, updateIncome,
    saveBudget
  } = useFinanceData();

  const [showLogin, setShowLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);

  const [filters, setFilters] = useState({ category: '', startDate: '', endDate: '' });
  const [incomeFilters, setIncomeFilters] = useState({ category: '', startDate: '', endDate: '' });
  const [search, setSearch] = useState('');
  const [incomeSearch] = useState('');
  const [activeTab, setActiveTab] = useState('expenses');
  const now = new Date();
  const [period, setPeriod] = useState({ type: 'month', month: now.getMonth(), year: now.getFullYear(), startDate: '', endDate: '' });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Filtering logic (for expenses)
  const filteredExpenses = expenses.filter(exp => {
    const matchesCategory = !filters.category || (exp.category && exp.category.includes(filters.category));
    const matchesSearch = !search ||
      exp.title.toLowerCase().includes(search.toLowerCase()) ||
      (exp.category && exp.category.toLowerCase().includes(search.toLowerCase())) ||
      String(exp.amount).includes(search);
    const matchesStart = !filters.startDate || new Date(exp.date) >= new Date(filters.startDate);
    const matchesEnd = !filters.endDate || new Date(exp.date) <= new Date(filters.endDate);
    return matchesCategory && matchesSearch && matchesStart && matchesEnd;
  });

  // Filtering logic (for incomes)
  const filteredIncomes = incomes.filter(inc => {
    const matchesCategory = !incomeFilters.category || (inc.category && inc.category.includes(incomeFilters.category));
    const matchesSearch = !incomeSearch ||
      inc.title.toLowerCase().includes(incomeSearch.toLowerCase()) ||
      (inc.category && inc.category.toLowerCase().includes(incomeSearch.toLowerCase())) ||
      String(inc.amount).includes(incomeSearch);
    const matchesStart = !incomeFilters.startDate || new Date(inc.date) >= new Date(incomeFilters.startDate);
    const matchesEnd = !incomeFilters.endDate || new Date(inc.date) <= new Date(incomeFilters.endDate);
    return matchesCategory && matchesSearch && matchesStart && matchesEnd;
  });

  // Filter by selected period or custom range
  let periodExpenses = expenses;
  let periodIncomes = incomes;
  if (period.type === 'month') {
    periodExpenses = expenses.filter(exp => {
      const d = new Date(exp.date);
      return d.getMonth() === period.month && d.getFullYear() === period.year;
    });
    periodIncomes = incomes.filter(inc => {
      const d = new Date(inc.date);
      return d.getMonth() === period.month && d.getFullYear() === period.year;
    });
  } else if (period.type === 'custom' && period.startDate && period.endDate) {
    const start = new Date(period.startDate);
    const end = new Date(period.endDate);
    periodExpenses = expenses.filter(exp => {
      const d = new Date(exp.date);
      return d >= start && d <= end;
    });
    periodIncomes = incomes.filter(inc => {
      const d = new Date(inc.date);
      return d >= start && d <= end;
    });
  }

  // Filter apply/clear
  const handleApplyFilters = () => setFilters({ ...filters });
  const handleClearFilters = () => setFilters({ category: '', startDate: '', endDate: '' });
  // Unused handlers removed: setIncomeSearch, handleApplyIncomeFilters, handleClearIncomeFilters

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center">
        {!showForgot ? (
          <>
            <div className="flex gap-4 mb-8">
              <button
                className={`px-6 py-2 rounded font-semibold transition-colors duration-200 ${showLogin ? 'bg-blue-500 text-white dark:bg-blue-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                onClick={() => { setShowLogin(true); setShowForgot(false); }}
              >
                Login
              </button>
              <button
                className={`px-6 py-2 rounded font-semibold transition-colors duration-200 ${!showLogin ? 'bg-green-500 text-white dark:bg-green-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                onClick={() => { setShowLogin(false); setShowForgot(false); }}
              >
                Register
              </button>
            </div>
            {showLogin ? <Login /> : <Register />}
            {showLogin && (
              <button className="mt-4 text-blue-600 dark:text-blue-400 underline" onClick={() => setShowForgot(true)}>
                Forgot password?
              </button>
            )}
          </>
        ) : (
          <ForgotPassword onSent={() => setShowForgot(false)} />
        )}
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | Spend Log</title>
        <meta name="description" content="View your expense and income dashboard, charts, and summaries in Spend Log." />
      </Helmet>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <DatePeriodSelector {...period} onChange={setPeriod} expenses={expenses} incomes={incomes} />
          <SummaryCards income={periodIncomes.reduce((sum, e) => sum + Number(e.amount), 0)} expenses={periodExpenses.reduce((sum, e) => sum + Number(e.amount), 0)} budget={budget} remaining={budget - periodExpenses.reduce((sum, e) => sum + Number(e.amount), 0)} />
          <TopCategories expenses={periodExpenses} incomes={periodIncomes} />
          <BudgetProgressBar expenses={periodExpenses} budget={budget} />
          <Suspense fallback={<div>Loading charts...</div>}>
            <SummaryTrendsChart expenses={periodExpenses} incomes={periodIncomes} />
          </Suspense>
          {activeTab === 'expenses' && (
            <>

              <ExpenseForm onAdd={addExpense} editingItem={editingExpense} onUpdate={updateExpense} onCancel={() => setEditingExpense(null)} />
              <SearchBar value={search} onChange={setSearch} />
              <Filters filters={filters} onChange={setFilters} onApply={handleApplyFilters} onClear={handleClearFilters} />
              <BudgetInput budget={budget} onSave={saveBudget} />
              <ExpenseList expenses={filteredExpenses} onDelete={deleteExpense} onEdit={setEditingExpense} />

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <Suspense fallback={<div>Loading chart...</div>}>
                    <ExpenseChart expenses={filteredExpenses} />
                  </Suspense>
                </div>
                <div className="flex-1">
                  <Suspense fallback={<div>Loading chart...</div>}>
                    <ExpenseBarChart expenses={filteredExpenses} />
                  </Suspense>
                </div>
              </div>
              <ExportSection expenses={filteredExpenses} />
            </>
          )}
          {activeTab === 'income' && (
            <>
              <IncomeForm onAdd={addIncome} editingItem={editingIncome} onUpdate={updateIncome} onCancel={() => setEditingIncome(null)} />
              <Suspense fallback={<div>Loading chart...</div>}>
                <IncomeChart incomes={filteredIncomes} />
                <IncomeList incomes={filteredIncomes} onDelete={deleteIncome} onEdit={setEditingIncome} />
              </Suspense>
              <Suspense fallback={<div>Loading chart...</div>}>
                <IncomeBarChart incomes={filteredIncomes} />
              </Suspense>
              <ExportIncomeSection incomes={filteredIncomes} />
            </>
          )}
        </main>
      </div>
    </>
  );
}

function App() {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = React.useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Spend Log - Track Your Expenses & Income</title>
          <meta name="description" content="Spend Log helps you track every penny, manage your expenses and income, and grow your savings." />
          <meta property="og:title" content="Spend Log - Track Your Expenses & Income" />
          <meta property="og:description" content="Spend Log helps you track every penny, manage your expenses and income, and grow your savings." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://yourdomain.com/" />
          <meta property="og:image" content="https://yourdomain.com/og-image.png" />
          <meta name="twitter:card" content="summary_large_image" />
        </Helmet>
        <Router>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/reset-password/:token" element={<ResetPasswordWrapper />} />
              <Route path="/profile" element={<Profile user={user} logout={logout} darkMode={darkMode} setDarkMode={setDarkMode} />} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />
              <Route path="/admin" element={
                <Suspense fallback={<div>Loading Admin Panel...</div>}>
                  <AdminPanel user={user} logout={logout} darkMode={darkMode} setDarkMode={setDarkMode} />
                </Suspense>
              } />
              <Route path="/" element={
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                  <AppContent />
                </motion.div>
              } />
              <Route path="/login" element={
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                  <Login />
                </motion.div>
              } />
              <Route path="/register" element={
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                  <Register />
                </motion.div>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </Router>
      </HelmetProvider>
    </>
  );
}

export default App;
