# Smart Expense Tracker API

A lightweight, robust REST API built with Node.js and Express to manage personal expenses, perform category filtering, and generate expenditure summaries.

---

## Features

- **Add Expenses:** Record new expenses with automatic UUID generation and date defaulting.
- **View & Filter Expenses:** Retrieve all expenses or filter by category (case-insensitive).
- **Summary Analytics:** Calculate overall expenditure totals and category breakdowns.
- **Monthly Breakdown (Bonus Feature):** Aggregate expenses aggregated by month (`YYYY-MM`) with optional year filtering.
- **Delete Expense:** Remove specific expenses by ID.
- **Strict Input Validation:** Handles invalid formats for dates (`YYYY-MM-DD`), non-numeric amounts, and empty fields with descriptive error responses.

---

## Tech Stack

- **Runtime:** Node.js (v16+)
- **Framework:** Express.js
- **Testing:** Jest & Supertest
- **Data Persistence:** In-memory store (JavaScript data structures)

---

## Project Structure

```text
smart-expense-tracker/
├── README.md           # Instructions, API documentation, and setup guide
├── AI_NOTES.md         # Documentation on AI tool usage and code validation
├── package.json        # Dependencies and execution scripts
├── src/
│   ├── app.js          # Express app configuration & route mounting
│   ├── server.js       # HTTP server entry point
│   ├── routes/
│   │   └── expenseRoutes.js # Route definitions & request validation
│   └── models/
│       └── expenseModel.js  # In-memory data store logic
└── tests/
    └── expense.test.js # Automated unit and integration tests

```

---

## Installation Instructions

Ensure you have **Node.js** (v16 or higher) and **npm** installed on your system.

1. Clone the repository and navigate into the project directory:
```bash
git clone https://github.com/tanushachoudhary/Smart_Expense_Tracker
cd smart-expense-tracker

```


2. Install dependencies:
```bash
npm install

```



---

## Running the Server

To start the API server locally on port 3000:

```bash
npm start

```

The server will start at `http://localhost:3000`.

---

## API Documentation

### 1. Add an Expense

* **URL:** `POST /expenses`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "title": "Groceries",
  "amount": 54.25,
  "category": "food",
  "date": "2026-07-31" // Optional. Defaults to current date (YYYY-MM-DD)
}

```


* **Success Response (201 Created):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "title": "Groceries",
  "amount": 54.25,
  "category": "food",
  "date": "2026-07-31"
}

```



---

### 2. View All Expenses (with optional category filter)

* **URL:** `GET /expenses`
* **Query Parameters:** `category` *(optional)* — e.g., `GET /expenses?category=food`
* **Success Response (200 OK):**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "title": "Groceries",
    "amount": 54.25,
    "category": "food",
    "date": "2026-07-31"
  }
]

```



---

### 3. Calculate Expense Summary

* **URL:** `GET /expenses/summary`
* **Query Parameters:** `category` *(optional)* — e.g., `GET /expenses/summary?category=food`
* **Success Response (200 OK):**
```json
{
  "total": 54.25,
  "count": 1,
  "byCategory": {
    "food": 54.25
  }
}

```



---

### 4. Monthly Summary (Bonus Endpoint)

* **URL:** `GET /expenses/summary/monthly`
* **Query Parameters:** `year` *(optional)* — e.g., `GET /expenses/summary/monthly?year=2026`
* **Success Response (200 OK):**
```json
{
  "2026-07": {
    "total": 154.25,
    "count": 3
  }
}

```



---

### 5. Delete an Expense

* **URL:** `DELETE /expenses/:id`
* **Example:** `DELETE /expenses/3fa85f64-5717-4562-b3fc-2c963f66afa6`
* **Success Response (200 OK):**
```json
{
  "message": "Expense deleted successfully."
}

```


* **Error Response (404 Not Found):**
```json
{
  "error": "Expense not found."
}

```



---

## Running Tests

Automated integration tests are built using **Jest** and **Supertest**. To run the test suite:

```bash
npm test

```

This will run all test suites covering POST validation, GET filtering, summary calculations, monthly aggregation, and DELETE operations.
