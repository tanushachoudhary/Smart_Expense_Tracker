const express = require('express');
const router = express.Router();
const expenseModel = require('../models/expenseModel');

// Regex to validate YYYY-MM-DD format
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Add an expense
router.post('/', (req, res) => {
  const { title, amount, category, date } = req.body;

 // 1. Check for required fields
  if (!title || amount === undefined || !category) {
    return res.status(400).json({ error: 'Title, amount, and category are required fields.' });
  }

  // 2. Validate title and category types
  if (typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title must be a non-empty string.' });
  }

   if (typeof category !== 'string' || category.trim().length === 0) {
    return res.status(400).json({ error: 'Category must be a non-empty string.' });
  }

  // 3. Validate amount type and positive value
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number greater than zero.' });
  }

 // 4. Validate optional date format if provided
  if (date !== undefined) {
    if (typeof date !== 'string' || !DATE_REGEX.test(date) || isNaN(Date.parse(date))) {
      return res.status(400).json({ error: 'Date must be a valid date string in YYYY-MM-DD format.' });
    }
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
  if (!id || id.trim().length === 0) {
    return res.status(400).json({ error: 'Expense ID is required.' });
  }
  const deleted = expenseModel.deleteById(id);

  if (!deleted) {
    return res.status(404).json({ error: 'Expense not found.' });
  }

  return res.status(200).json({ message: 'Expense deleted successfully.' });
});

// Get monthly breakdown of expenses
// Example: GET /expenses/summary/monthly?year=2026
router.get('/summary/monthly', (req, res) => {
  const { year } = req.query;

  // Validate year query param if passed
  if (year && (!/^\d{4}$/.test(year) || isNaN(Number(year)))) {
    return res.status(400).json({ error: 'Year parameter must be a 4-digit number (e.g., 2026).' });
  }

  const monthlySummary = expenseModel.getMonthlySummary(year);
  return res.status(200).json(monthlySummary);
});

module.exports = router;