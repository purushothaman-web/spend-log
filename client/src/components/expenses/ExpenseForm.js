import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

function ExpenseForm({ onAdd, editingItem, onUpdate, onCancel }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceInterval, setRecurrenceInterval] = useState('monthly');

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setAmount(editingItem.amount);
      setCategory(editingItem.category);
      setDate(new Date(editingItem.date).toISOString().split('T')[0]);
      setIsRecurring(editingItem.isRecurring || false);
      setRecurrenceInterval(editingItem.recurrenceInterval || 'monthly');
    } else {
      setTitle('');
      setAmount('');
      setCategory('');
      setDate('');
      setIsRecurring(false);
      setRecurrenceInterval('monthly');
    }
  }, [editingItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !category || !date) return;
    const expenseData = {
      title,
      amount: parseFloat(amount),
      category,
      date,
      isRecurring,
      recurrenceInterval: isRecurring ? recurrenceInterval : undefined
    };

    if (editingItem) {
      onUpdate({ ...editingItem, ...expenseData });
    } else {
      onAdd(expenseData);
    }

    if (!editingItem) {
      setTitle('');
      setAmount('');
      setCategory('');
      setDate('');
      setIsRecurring(false);
      setRecurrenceInterval('monthly');
    }
  };

  return (
    <>
      <Helmet>
        <title>{editingItem ? 'Edit Expense' : 'Add Expense'} | Spend Log</title>
        <meta name="description" content={editingItem ? "Edit an existing expense." : "Add a new expense to your Spend Log account and track your spending."} />
      </Helmet>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div>
          <label htmlFor="expenseName" className="block text-sm font-medium mb-1 dark:text-gray-200">Expense Name</label>
          <input type="text" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white" id="expenseName" placeholder="e.g., Coffee, Taxi" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="expenseCategory" className="block text-sm font-medium mb-1 dark:text-gray-200">Expense Category</label>
          <select className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white" id="expenseCategory" value={category} onChange={e => setCategory(e.target.value)} required>
            <option value="">Select category</option>
            <option>🍽️ Food</option>
            <option>✈️ Travel</option>
            <option>🛍️ Shopping</option>
            <option>📄 Bills</option>
            <option>📦 Others</option>
          </select>
        </div>
        <div>
          <label htmlFor="expenseAmount" className="block text-sm font-medium mb-1 dark:text-gray-200">Amount</label>
          <input type="number" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white" id="expenseAmount" placeholder="₹" value={amount} onChange={e => setAmount(e.target.value)} required />
        </div>
        <div>
          <input type="date" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white" id="expenseDate" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div className="md:col-span-5 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isRecurring"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              checked={isRecurring}
              onChange={e => setIsRecurring(e.target.checked)}
            />
            <label htmlFor="isRecurring" className="text-sm font-medium dark:text-gray-200">Recurring Payment?</label>
          </div>
          {isRecurring && (
            <div>
              <select
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white text-sm"
                value={recurrenceInterval}
                onChange={e => setRecurrenceInterval(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}
        </div>
        <div className="md:col-span-5">
          <motion.button
            type="submit"
            className="w-full bg-blue-500 dark:bg-blue-700 text-white rounded px-3 py-2 font-semibold hover:bg-blue-600 dark:hover:bg-blue-800 transition"
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.03 }}
            aria-label="Add expense"
          >
            {editingItem ? 'Update' : 'Add'}
          </motion.button>
          {editingItem && (
            <button
              type="button"
              className="w-full mt-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded px-3 py-2 font-semibold hover:bg-gray-400 dark:hover:bg-gray-600 transition"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </>
  );
}

export default ExpenseForm; 