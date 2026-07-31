const request = require("supertest");
const app = require("../src/app");
const expenseModel = require("../src/models/expenseModel");

describe("Smart Expense Tracker API", () => {
  beforeEach(() => {
    expenseModel.clearAll();
  });

  test("POST /expenses - should create a new expense", async () => {
    const res = await request(app).post("/expenses").send({
      title: "Groceries",
      amount: 54.25,
      category: "Food",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Groceries");
    expect(res.body.amount).toBe(54.25);
    expect(res.body.category).toBe("food");
  });

  test("POST /expenses - should return 400 for invalid date format", async () => {
    const res = await request(app).post("/expenses").send({
      title: "Groceries",
      amount: 45.5,
      category: "food",
      date: "31-07-2026", // Invalid format (should be YYYY-MM-DD)
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      error: "Date must be a valid date string in YYYY-MM-DD format.",
    });
  });

  test("POST /expenses - should return 400 for empty string title or category", async () => {
    const res = await request(app).post("/expenses").send({
      title: "   ",
      amount: 15,
      category: "food",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      error: "Title must be a non-empty string.",
    });
  });

  test("POST /expenses - should return 400 for invalid data", async () => {
    const res = await request(app).post("/expenses").send({
      title: "Coffee",
      amount: -5,
    });

    expect(res.statusCode).toEqual(400);
  });

  test("GET /expenses - should retrieve all expenses and filter by category", async () => {
    expenseModel.create({ title: "Lunch", amount: 12, category: "food" });
    expenseModel.create({
      title: "Bus Ticket",
      amount: 3,
      category: "transport",
    });

    const allRes = await request(app).get("/expenses");
    expect(allRes.statusCode).toEqual(200);
    expect(allRes.body.length).toBe(2);

    const filterRes = await request(app).get("/expenses?category=food");
    expect(filterRes.statusCode).toEqual(200);
    expect(filterRes.body.length).toBe(1);
    expect(filterRes.body[0].title).toBe("Lunch");
  });

  test("GET /expenses/summary - should return correct totals", async () => {
    expenseModel.create({ title: "Lunch", amount: 15, category: "food" });
    expenseModel.create({ title: "Dinner", amount: 25, category: "food" });
    expenseModel.create({ title: "Taxi", amount: 10, category: "transport" });

    const res = await request(app).get("/expenses/summary");
    expect(res.statusCode).toEqual(200);
    expect(res.body.total).toBe(50);
    expect(res.body.byCategory.food).toBe(40);
    expect(res.body.byCategory.transport).toBe(10);
  });

  test("DELETE /expenses/:id - should remove an expense", async () => {
    const expense = expenseModel.create({
      title: "Book",
      amount: 20,
      category: "education",
    });

    const deleteRes = await request(app).delete(`/expenses/${expense.id}`);
    expect(deleteRes.statusCode).toEqual(200);

    const fetchRes = await request(app).get("/expenses");
    expect(fetchRes.body.length).toBe(0);
  });
  test("GET /expenses/summary/monthly - should aggregate totals and count by month", async () => {
    // Add expenses across different dates
    expenseModel.create({
      title: "Groceries",
      amount: 50,
      category: "food",
      date: "2026-07-05",
    });
    expenseModel.create({
      title: "Utilities",
      amount: 100,
      category: "bills",
      date: "2026-07-20",
    });
    expenseModel.create({
      title: "Streaming",
      amount: 15,
      category: "entertainment",
      date: "2026-08-01",
    });

    // Test overall monthly breakdown
    const resAll = await request(app).get("/expenses/summary/monthly");
    expect(resAll.statusCode).toEqual(200);
    expect(resAll.body).toHaveProperty("2026-07");
    expect(resAll.body).toHaveProperty("2026-08");
    expect(resAll.body["2026-07"].total).toBe(150);
    expect(resAll.body["2026-07"].count).toBe(2);
    expect(resAll.body["2026-08"].total).toBe(15);
    expect(resAll.body["2026-08"].count).toBe(1);

    // Test filtered by year query param
    const resFiltered = await request(app).get(
      "/expenses/summary/monthly?year=2026",
    );
    expect(resFiltered.statusCode).toEqual(200);
    expect(Object.keys(resFiltered.body)).toHaveLength(2);
  });
  test("GET /expenses/summary/monthly - should return 400 for invalid year format", async () => {
    const res = await request(app).get("/expenses/summary/monthly?year=202");

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      error: "Year parameter must be a 4-digit number (e.g., 2026).",
    });
  });
});
