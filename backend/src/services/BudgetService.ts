// backend/src/services/budgetService.ts

import Budget, { IBudget } from '../models/Budget';

/**
 * Create a new budget or update an existing one for a given category and period.
 * @param data Partial budget data (should include category, month, year, and budget)
 * @returns The created or updated budget document
 * @throws Error if required fields are missing.
 */
export async function createOrUpdateBudget(data: Partial<IBudget>): Promise<IBudget> {
  const { category, month, year, budget } = data;

  // Validate required fields
  if (!category || month == null || year == null || budget == null) {
    throw new Error('Missing required fields: category, month, year, or budget.');
  }

  // Check for an existing budget for the given category, month, and year
  const existingBudget = await Budget.findOne({ category, month, year });
  if (existingBudget) {
    existingBudget.budget = budget;
    return await existingBudget.save();
  }

  // Otherwise, create a new budget entry
  const newBudget = new Budget(data);
  return await newBudget.save();
}

/**
 * Retrieve all budgets.
 * @returns An array of budget documents
 */
export async function getBudgets(): Promise<IBudget[]> {
  return await Budget.find();
}
