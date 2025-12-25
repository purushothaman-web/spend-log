import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function useFinanceData() {
    const { token, fetchWithAuth } = useAuth();
    const { showToast } = useToast();

    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [budget, setBudget] = useState(() => {
        const saved = localStorage.getItem('budget');
        return saved ? Number(saved) : 0;
    });

    // Fetch initial data
    useEffect(() => {
        if (!token) {
            setExpenses([]);
            setIncomes([]);
            return;
        }

        // Fetch expenses
        fetchWithAuth('/api/expenses')
            .then(res => res.json())
            .then(data => {
                setExpenses(Array.isArray(data) ? data : []);
            })
            .catch(() => setExpenses([]));

        // Fetch income
        fetchWithAuth('/api/income')
            .then(res => res.json())
            .then(data => {
                setIncomes(Array.isArray(data) ? data : []);
            })
            .catch(() => setIncomes([]));
    }, [token, fetchWithAuth]);

    // Expenses Actions
    const addExpense = useCallback((expense) => {
        fetchWithAuth('/api/expenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense),
        })
            .then(res => res.json())
            .then(newExpense => {
                setExpenses(prev => [newExpense, ...prev]);
                showToast('Expense added!', 'success');
            })
            .catch(() => showToast('Failed to add expense', 'error'));
    }, [fetchWithAuth, showToast]);

    const deleteExpense = useCallback((id) => {
        fetchWithAuth(`/api/expenses/${id}`, { method: 'DELETE' })
            .then(() => {
                setExpenses(prev => prev.filter(e => (e._id || e.id) !== id));
                showToast('Expense deleted!', 'success');
            })
            .catch(() => showToast('Failed to delete expense', 'error'));
    }, [fetchWithAuth, showToast]);

    const updateExpense = useCallback((updatedExpense) => {
        const id = updatedExpense._id || updatedExpense.id;
        fetchWithAuth(`/api/expenses/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedExpense),
        })
            .then(res => res.json())
            .then(data => {
                setExpenses(prev => prev.map(e => (e._id || e.id) === (data._id || data.id) ? data : e));
                showToast('Expense updated!', 'success');
            })
            .catch(() => showToast('Failed to update expense', 'error'));
    }, [fetchWithAuth, showToast]);

    // Income Actions
    const addIncome = useCallback((income) => {
        fetchWithAuth('/api/income', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(income),
        })
            .then(res => res.json())
            .then(newIncome => {
                setIncomes(prev => [newIncome, ...prev]);
                showToast('Income added!', 'success');
            })
            .catch(() => showToast('Failed to add income', 'error'));
    }, [fetchWithAuth, showToast]);

    const deleteIncome = useCallback((id) => {
        fetchWithAuth(`/api/income/${id}`, { method: 'DELETE' })
            .then(() => {
                setIncomes(prev => prev.filter(e => (e._id || e.id) !== id));
                showToast('Income deleted!', 'success');
            })
            .catch(() => showToast('Failed to delete income', 'error'));
    }, [fetchWithAuth, showToast]);

    const updateIncome = useCallback((updatedIncome) => {
        const id = updatedIncome._id || updatedIncome.id;
        fetchWithAuth(`/api/income/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedIncome),
        })
            .then(res => res.json())
            .then(data => {
                setIncomes(prev => prev.map(i => (i._id || i.id) === (data._id || data.id) ? data : i));
                showToast('Income updated!', 'success');
            })
            .catch(() => showToast('Failed to update income', 'error'));
    }, [fetchWithAuth, showToast]);

    // Budget Actions
    const saveBudget = useCallback((value) => {
        setBudget(value);
        localStorage.setItem('budget', value);
        showToast('Budget updated!', 'success');
    }, [showToast]);

    return {
        expenses,
        incomes,
        budget,
        addExpense,
        deleteExpense,
        updateExpense,
        addIncome,
        deleteIncome,
        updateIncome,
        saveBudget
    };
}
