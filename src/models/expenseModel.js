const { v4: uuidv4 } = require('uuid');

class ExpenseModel {
  constructor() {
    this.expenses = [];
  }

  // Clear in-memory array (useful for resetting state in tests)
  clearAll() {
    this.expenses = [];
  }

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

  findAll(categoryFilter = null) {
    if (categoryFilter) {
      const targetCategory = categoryFilter.toLowerCase().trim();
      return this.expenses.filter((exp) => exp.category === targetCategory);
    }
    return this.expenses;
  }

  findById(id) {
    return this.expenses.find((exp) => exp.id === id);
  }

  deleteById(id) {
    const index = this.expenses.findIndex((exp) => exp.id === id);
    if (index === -1) return false;
    this.expenses.splice(index, 1);
    return true;
  }

  getSummary(categoryFilter = null) {
    const filtered = this.findAll(categoryFilter);
    const totalAmount = filtered.reduce((sum, exp) => sum + exp.amount, 0);

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
}

module.exports = new ExpenseModel();
