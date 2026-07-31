const express = require('express');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

app.use(express.json());
app.use('/expenses', expenseRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
