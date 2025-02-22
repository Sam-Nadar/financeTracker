"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/budgetRoutes.ts
const express_1 = require("express");
const BudgetController_1 = require("../controllers/BudgetController");
const BudgetController_2 = require("../controllers/BudgetController");
const router = (0, express_1.Router)();
// Create a new budget
router.post('/', BudgetController_1.createBudget);
// Update an existing budget by ID
router.put('/:id', BudgetController_2.updateBudget);
// Delete a budget by ID
router.delete('/:id', BudgetController_1.deleteBudget);
// Get budgets with pagination
router.get('/', BudgetController_1.getBudgets);
router.get('/comparison', BudgetController_1.getBudgetComparison);
exports.default = router;
