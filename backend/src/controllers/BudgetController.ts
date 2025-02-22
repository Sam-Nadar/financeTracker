
import { Request, Response,RequestHandler } from 'express';
import Budget from '../models/Budget';
import Transaction from '../models/Transaction';


// Create a new budget
export const createBudget: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { category, month, year, budget } = req.body;
      // Check if a budget already exists for the given category, month, and year.
      const existingBudget = await Budget.findOne({ category, month, year });
      if (existingBudget) {
        // Return a 409 Conflict with a message.
        res.status(409).json({
          error: 'Budget for this category, month, and year already exists. Please update the existing budget instead.',
        });
        return;
      }
      // If it doesn't exist, create a new budget.
      const newBudget = new Budget({ category, month, year, budget });
      await newBudget.save();
      res.status(201).json(newBudget);
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  };

// Update an existing budget by ID

export const updateBudget: RequestHandler = async (req, res): Promise<void> => {
  try {
    const budgetId = req.params.id;
    const { category, month, year, budget } = req.body;
    const updatedBudget = await Budget.findByIdAndUpdate(
      budgetId,
      { category, month, year, budget },
      { new: true }
    );
    if (!updatedBudget) {
      res.status(404).json({ error: 'Budget not found' });
      return;
    }
    res.status(200).json(updatedBudget);
    return;
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    return;
  }
};



// Delete a budget by ID
export const deleteBudget: RequestHandler = async (req, res): Promise<void> => {
    try {
      const budgetId = req.params.id;
      const deletedBudget = await Budget.findByIdAndDelete(budgetId);
      if (!deletedBudget) {
        res.status(404).json({ error: 'Budget not found' });
        return;
      }
      res.status(200).json({ message: 'Budget deleted successfully' });
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  };
// Get budgets with pagination
export const getBudgets = async (req: Request, res: Response) => {
  try {
    // Parse pagination parameters; default to page 1 and limit 10
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    // Optionally sort by year and month
    const budgets = await Budget.find()
      .sort({ year: 1, month: 1 })
      .skip(skip)
      .limit(limit);

    const totalBudgets = await Budget.countDocuments();
    const totalPages = Math.ceil(totalBudgets / limit);

    res.status(200).json({
      budgets,
      totalPages,
      currentPage: page,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};



export const getBudgetComparison = async (req: Request, res: Response): Promise<void> => {
  try {
    // Aggregate actual spending by category
    const actuals = await Transaction.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      }
    ]);

    // Aggregate budget by category
    const budgets = await Budget.aggregate([
      {
        $group: {
          _id: "$category",
          totalBudget: { $sum: "$budget" }
        }
      }
    ]);

    // Combine both results into a single array per category
    const categories = new Set([
      ...actuals.map((a: any) => a._id),
      ...budgets.map((b: any) => b._id)
    ]);

    const comparison = Array.from(categories).map((cat) => {
      const actualObj = actuals.find((a: any) => a._id === cat);
      const budgetObj = budgets.find((b: any) => b._id === cat);
      return {
        category: cat,
        actual: actualObj ? actualObj.total : 0,
        budget: budgetObj ? budgetObj.totalBudget : 0
      };
    });

    res.status(200).json(comparison);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
