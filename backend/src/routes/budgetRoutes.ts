// backend/src/routes/budgetRoutes.ts
import { Router } from 'express';
import { createBudget, deleteBudget, getBudgetComparison, getBudgets } from '../controllers/BudgetController';
import { updateBudget } from '../controllers/BudgetController';

const router = Router();

// Create a new budget
router.post('/', createBudget);

// Update an existing budget by ID
router.put('/:id', updateBudget );

// Delete a budget by ID
router.delete('/:id', deleteBudget);

// Get budgets with pagination
router.get('/', getBudgets);
router.get('/comparison', getBudgetComparison);


export default router;
