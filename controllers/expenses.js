// controllers/expenses.js
const Expense = require('../models/Expense');

// Create a new expense
exports.createExpense = async (req, res) => {
    try {
        const { amount, description } = req.body;
        const newExpense = new Expense({ amount, description });
        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get all expenses
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get a single expense by ID
exports.getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update an expense by ID
exports.updateExpense = async (req, res) => {
    try {
        const { amount, description } = req.body;
        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            { amount, description },
            { new: true }
        );
        if (!updatedExpense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.status(200).json(updatedExpense);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete an expense by ID
exports.deleteExpense = async (req, res) => {
    try {
        const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
        if (!deletedExpense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
