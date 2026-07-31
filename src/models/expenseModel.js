// Used for generating unique IDs for each expense record.
const { v4: uuidv4 } = require('uuid');

// In-memory expense store model.
// Note: Data is not persisted and resets when the server restarts.
class ExpenseModel {
  constructor() {
    // Holds all expense objects for the current runtime session.
    this.expenses = [];
  }

  // Clear in-memory array (useful for resetting state in tests)
  clearAll() {
    this.expenses = [];
  }

  // Create and store a new expense.
  // - `amount` is normalized to a Number
  // - `category` is normalized to lowercase trimmed text
  // - `date` defaults to today's YYYY-MM-DD if not provided
  create({ title, amount, category, date }) {
    const newExpense = {
      id: uuidv4(),
      title,
      amount: Number(amount),
      category: category.toLowerCase().trim(),
      date: date || new Date().toISOString().split('T')[0]
    };
    this.expenses.push(newExpense);
    return newExpense;
  }

  // Return all expenses, or only those matching a category filter.
  findAll(categoryFilter = null) {
    if (categoryFilter) {
      const targetCategory = categoryFilter.toLowerCase().trim();
      return this.expenses.filter((exp) => exp.category === targetCategory);
    }
    return this.expenses;
  }

  // Find a single expense by its unique ID.
  findById(id) {
    return this.expenses.find((exp) => exp.id === id);
  }

  // Delete an expense by ID.
  // Returns true when deleted, false if no matching expense exists.
  deleteById(id) {
    const index = this.expenses.findIndex((exp) => exp.id === id);
    if (index === -1) return false;
    this.expenses.splice(index, 1);
    return true;
  }

  // Generate summary stats.
  // - `total` and `count` are based on filtered results (if filter provided)
  // - `byCategory` is computed from all stored expenses
  getSummary(categoryFilter = null) {
    const filtered = this.findAll(categoryFilter);
    const totalAmount = filtered.reduce((sum, exp) => sum + exp.amount, 0);

    // Build category totals map: { food: 120, travel: 60, ... }
    const categoryBreakdown = this.expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    return {
      total: Number(totalAmount.toFixed(2)),
      count: filtered.length,
      byCategory: categoryBreakdown
    };
  }
  getMonthlySummary(year) {
  // Aggregate expenses grouped by YYYY-MM
  return this.expenses.reduce((acc, exp) => {
    const month = exp.date.substring(0, 7); // Extracts "YYYY-MM"
    
    // If year parameter provided, filter by that year
    if (year && !month.startsWith(year)) {
      return acc;
    }

    if (!acc[month]) {
      acc[month] = { total: 0, count: 0 };
    }

    acc[month].total = Number((acc[month].total + exp.amount).toFixed(2));
    acc[month].count += 1;
    
    return acc;
  }, {});
}
}

module.exports = new ExpenseModel();
