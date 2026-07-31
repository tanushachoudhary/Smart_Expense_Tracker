const express = require('express');
const router = express.Router();
const expenseModel = require('../models/expenseModel');

// Add an expense
router.post('/', (req, res) => {
  const { title, amount, category, date } = req.body;

  if (!title || amount === undefined || !category) {
    return res.status(400).json({ error: 'Title, amount, and category are required fields.' });
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number.' });
  }

  const newExpense = expenseModel.create({ title, amount, category, date });
  return res.status(201).json(newExpense);
});

// View all expenses (Optional filter by category via query param: ?category=food)
router.get('/', (req, res) => {
  const { category } = req.query;
  const expenses = expenseModel.findAll(category);
  return res.status(200).json(expenses);
});

// Calculate totals (overall & by category)
router.get('/summary', (req, res) => {
  const { category } = req.query;
  const summary = expenseModel.getSummary(category);
  return res.status(200).json(summary);
});

// Delete an expense
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const deleted = expenseModel.deleteById(id);

  if (!deleted) {
    return res.status(404).json({ error: 'Expense not found.' });
  }

  return res.status(200).json({ message: 'Expense deleted successfully.' });
});

module.exports = router;
