import express from 'express';
import cors from 'cors';
import transactionRoutes from './routes/transactionRoutes';
import budgetRoutes from './routes/budgetRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);

export default app;
