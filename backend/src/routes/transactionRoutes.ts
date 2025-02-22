import { Router } from 'express';
import { createTransaction, getTransactions, updateTransaction, deleteTransaction,getCategoryBreakdown,getRecentTransactions, getMonthlyExpenses } from '../controllers/TransactionController';

const router = Router();

router.post('/', createTransaction);
router.get('/', getTransactions);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);
router.get('/category-breakdown',getCategoryBreakdown)
router.get('/recent', getRecentTransactions);
router.get('/monthly-expenses',getMonthlyExpenses)

export default router;
