import { Request, Response } from 'express';
import Transaction from '../models/Transaction';

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
    try {
      // Parse pagination parameters from query; default to page 1 and limit 10
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const skip = (page - 1) * limit;
  
      // Fetch transactions sorted by date (descending) with skip and limit
      const transactions = await Transaction.find()
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);
  
      // Count total transactions to calculate total pages
      const totalTransactions = await Transaction.countDocuments();
      const totalPages = Math.ceil(totalTransactions / limit);
  
      res.status(200).json({
        transactions,
        totalPages,
        currentPage: page,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(transaction);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Transaction deleted' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};


export const getCategoryBreakdown = async (req: Request, res: Response) => {
  try {
    const breakdown = await Transaction.aggregate([
      { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ]);
    // Transform the result into a more friendly format if needed:
    const result = breakdown.map((item) => ({ category: item._id, total: item.total }));
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getRecentTransactions = async (req: Request, res: Response) => {
    try {
      // Get the limit from the query parameters, defaulting to 5 if not provided
      const limit = parseInt(req.query.limit as string, 10) || 5;
      // Find transactions sorted by _id descending (most recent first)
      const recentTransactions = await Transaction.find().sort({ _id: -1 }).limit(limit);
      res.status(200).json(recentTransactions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };


  export const getMonthlyExpenses = async (req: Request, res: Response): Promise<void> => {
    try {
      const expenses = await Transaction.aggregate([
        {
          $group: {
            _id: { $month: "$date" },
            total: { $sum: "$amount" }
          }
        },
        { $sort: { "_id": 1 } }
      ]);
      // Ensure all 12 months are represented
      const monthlyExpenses = [];
      for (let i = 1; i <= 12; i++) {
        const expense = expenses.find((e: any) => e._id === i);
        monthlyExpenses.push({ month: i, amount: expense ? expense.total : 0 });
      }
      res.status(200).json(monthlyExpenses);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };