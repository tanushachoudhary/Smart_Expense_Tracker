# AI Usage Notes

## 1. AI-Generated vs. Self-Written Code

**AI-Generated (initial draft):**
- Overall project structure and boilerplate (Express app/server split, package.json)
- Core CRUD routes (`POST /expenses`, `GET /expenses`, `DELETE /expenses/:id`)
- In-memory data model (`expenseModel.js`)
- Base test suite in `tests/expense.test.js`

**Written/Modified by Me:**
- Added inline comments throughout the route and model files to document intent and edge cases
- Extended input validation in `expenseRoutes.js`:
  - Type checks on `title`/`category` to reject non-string input
  - Empty-string checks on `title`/`category` (the original draft only checked for missing fields, not blank ones)
  - Date format validation (reject malformed `date` values instead of silently accepting them)
  - Parameter validation on `DELETE /expenses/:id` (reject missing/malformed `id`)
- Updated error messages to be specific to which check failed, instead of one generic "invalid input" message, so API consumers can tell what's wrong
- Added a new endpoint: `GET /expenses/summary/monthly` — aggregates total amount and expense count grouped by month (`YYYY-MM`), with an optional `?year=` filter
- Added a corresponding test for the monthly summary endpoint, covering both the ungrouped and year-filtered cases

## 2. Validation and Refinements Made
- Ran the full test suite (`npm test`) after each change — all cases passed, including the new monthly summary test
- Manually exercised the new validation
