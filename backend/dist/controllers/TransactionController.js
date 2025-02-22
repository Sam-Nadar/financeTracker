"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthlyExpenses = exports.getRecentTransactions = exports.getCategoryBreakdown = exports.deleteTransaction = exports.updateTransaction = exports.getTransactions = exports.createTransaction = void 0;
const Transaction_1 = __importDefault(require("../models/Transaction"));
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = new Transaction_1.default(req.body);
        yield transaction.save();
        res.status(201).json(transaction);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.createTransaction = createTransaction;
const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Parse pagination parameters from query; default to page 1 and limit 10
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        // Fetch transactions sorted by date (descending) with skip and limit
        const transactions = yield Transaction_1.default.find()
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);
        // Count total transactions to calculate total pages
        const totalTransactions = yield Transaction_1.default.countDocuments();
        const totalPages = Math.ceil(totalTransactions / limit);
        res.status(200).json({
            transactions,
            totalPages,
            currentPage: page,
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.getTransactions = getTransactions;
const updateTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield Transaction_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(transaction);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.updateTransaction = updateTransaction;
const deleteTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Transaction_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Transaction deleted' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.deleteTransaction = deleteTransaction;
const getCategoryBreakdown = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const breakdown = yield Transaction_1.default.aggregate([
            { $group: { _id: '$category', total: { $sum: '$amount' } } }
        ]);
        // Transform the result into a more friendly format if needed:
        const result = breakdown.map((item) => ({ category: item._id, total: item.total }));
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.getCategoryBreakdown = getCategoryBreakdown;
const getRecentTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the limit from the query parameters, defaulting to 5 if not provided
        const limit = parseInt(req.query.limit, 10) || 5;
        // Find transactions sorted by _id descending (most recent first)
        const recentTransactions = yield Transaction_1.default.find().sort({ _id: -1 }).limit(limit);
        res.status(200).json(recentTransactions);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.getRecentTransactions = getRecentTransactions;
const getMonthlyExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expenses = yield Transaction_1.default.aggregate([
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
            const expense = expenses.find((e) => e._id === i);
            monthlyExpenses.push({ month: i, amount: expense ? expense.total : 0 });
        }
        res.status(200).json(monthlyExpenses);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.getMonthlyExpenses = getMonthlyExpenses;
