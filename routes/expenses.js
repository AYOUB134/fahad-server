// routes/expenses.js
const express = require('express');
const router = express.Router();
const expensesController = require('../controllers/expenses');

router.post('/', expensesController.createExpense);
router.get('/', expensesController.getExpenses);
router.get('/:id', expensesController.getExpenseById);
router.put('/:id', expensesController.updateExpense);
router.delete('/:id', expensesController.deleteExpense);

module.exports = router;
