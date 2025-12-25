import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

function IncomeForm({ onAdd, editingItem, onUpdate, onCancel }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setAmount(editingItem.amount);
      setCategory(editingItem.category);
      setDate(new Date(editingItem.date).toISOString().split('T')[0]);
    } else {
      setTitle('');
      setAmount('');
      setCategory('');
      setDate('');
    }
  }, [editingItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !category || !date) return;
    const incomeData = { title, amount: parseFloat(amount), category, date };

    if (editingItem) {
      onUpdate({ ...editingItem, ...incomeData });
    } else {
      onAdd(incomeData);
    }

    if (!editingItem) {
      setTitle('');
      setAmount('');
      setCategory('');
      setDate('');
    }
  };

  return (
    <>
      <Helmet>
        <title>{editingItem ? 'Edit Income' : 'Add Income'} | Spend Log</title>
        <meta name="description" content={editingItem ? "Edit an existing income entry." : "Add a new income entry to your Spend Log account and track your earnings."} />
      </Helmet>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div>
          <label htmlFor="incomeName" className="block text-sm font-medium mb-1 dark:text-gray-200">Income Name</label>
          <input type="text" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-900 dark:text-white" id="incomeName" placeholder="e.g., Salary, Freelance" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="incomeCategory" className="block text-sm font-medium mb-1 dark:text-gray-200">Income Category</label>
          <select className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-900 dark:text-white" id="incomeCategory" value={category} onChange={e => setCategory(e.target.value)} required>
            <option value="">Select category</option>
            <option>💼 Salary</option>
            <option>🧑‍💻 Freelance</option>
            <option>🎁 Gift</option>
            <option>💸 Investment</option>
            <option>📦 Others</option>
          </select>
        </div>
        <div>
          <label htmlFor="incomeAmount" className="block text-sm font-medium mb-1 dark:text-gray-200">Amount</label>
          <input type="number" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-900 dark:text-white" id="incomeAmount" placeholder="₹" value={amount} onChange={e => setAmount(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="incomeDate" className="block text-sm font-medium mb-1 dark:text-gray-200">Date</label>
          <input type="date" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-900 dark:text-white" id="incomeDate" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div>
          <motion.button
            type="submit"
            className="w-full bg-green-500 dark:bg-green-700 text-white rounded px-3 py-2 font-semibold hover:bg-green-600 dark:hover:bg-green-800 transition"
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.03 }}
            aria-label="Add income"
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

export default IncomeForm; 