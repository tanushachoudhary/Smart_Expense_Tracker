const request = require('supertest');
const app = require('../src/app');
const expenseModel = require('../src/models/expenseModel');

describe('Smart Expense Tracker API', () => {
  beforeEach(() => {
    expenseModel.clearAll();
  });

  test('POST /expenses - should create a new expense', async () => {
    const res = await request(app).post('/expenses').send({
      title: 'Groceries',
      amount: 54.25,
      category: 'Food'
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Groceries');
    expect(res.body.amount).toBe(54.25);
    expect(res.body.category).toBe('food');
  });

  test('POST /expenses - should return 400 for invalid data', async () => {
    const res = await request(app).post('/expenses').send({
      title: 'Coffee',
      amount: -5
    });

    expect(res.statusCode).toEqual(400);
  });

  test('GET /expenses - should retrieve all expenses and filter by category', async () => {
    expenseModel.create({ title: 'Lunch', amount: 12, category: 'food' });
    expenseModel.create({ title: 'Bus Ticket', amount: 3, category: 'transport' });

    const allRes = await request(app).get('/expenses');
    expect(allRes.statusCode).toEqual(200);
    expect(allRes.body.length).toBe(2);

    const filterRes = await request(app).get('/expenses?category=food');
    expect(filterRes.statusCode).toEqual(200);
    expect(filterRes.body.length).toBe(1);
    expect(filterRes.body[0].title).toBe('Lunch');
  });

  test('GET /expenses/summary - should return correct totals', async () => {
    expenseModel.create({ title: 'Lunch', amount: 15, category: 'food' });
    expenseModel.create({ title: 'Dinner', amount: 25, category: 'food' });
    expenseModel.create({ title: 'Taxi', amount: 10, category: 'transport' });

    const res = await request(app).get('/expenses/summary');
    expect(res.statusCode).toEqual(200);
    expect(res.body.total).toBe(50);
    expect(res.body.byCategory.food).toBe(40);
    expect(res.body.byCategory.transport).toBe(10);
  });

  test('DELETE /expenses/:id - should remove an expense', async () => {
    const expense = expenseModel.create({ title: 'Book', amount: 20, category: 'education' });

    const deleteRes = await request(app).delete(`/expenses/${expense.id}`);
    expect(deleteRes.statusCode).toEqual(200);

    const fetchRes = await request(app).get('/expenses');
    expect(fetchRes.body.length).toBe(0);
  });
});
