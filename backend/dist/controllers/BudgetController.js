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
exports.getBudgetComparison = exports.getBudgets = exports.deleteBudget = exports.updateBudget = exports.createBudget = void 0;
const Budget_1 = __importDefault(require("../models/Budget"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
// Create a new budget
const createBudget = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, month, year, budget } = req.body;
        // Check if a budget already exists for the given category, month, and year.
        const existingBudget = yield Budget_1.default.findOne({ category, month, year });
        if (existingBudget) {
            // Return a 409 Conflict with a message.
            res.status(409).json({
                error: 'Budget for this category, month, and year already exists. Please update the existing budget instead.',
            });
            return;
        }
        // If it doesn't exist, create a new budget.
        const newBudget = new Budget_1.default({ category, month, year, budget });
        yield newBudget.save();
        res.status(201).json(newBudget);
        return;
    }
    catch (error) {
        res.status(400).json({ error: error.message });
        return;
    }
});
exports.createBudget = createBudget;
// Update an existing budget by ID
const updateBudget = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const budgetId = req.params.id;
        const { category, month, year, budget } = req.body;
        const updatedBudget = yield Budget_1.default.findByIdAndUpdate(budgetId, { category, month, year, budget }, { new: true });
        if (!updatedBudget) {
            res.status(404).json({ error: 'Budget not found' });
            return;
        }
        res.status(200).json(updatedBudget);
        return;
    }
    catch (error) {
        res.status(400).json({ error: error.message });
        return;
    }
});
exports.updateBudget = updateBudget;
// Delete a budget by ID
const deleteBudget = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const budgetId = req.params.id;
        const deletedBudget = yield Budget_1.default.findByIdAndDelete(budgetId);
        if (!deletedBudget) {
            res.status(404).json({ error: 'Budget not found' });
            return;
        }
        res.status(200).json({ message: 'Budget deleted successfully' });
        return;
    }
    catch (error) {
        res.status(400).json({ error: error.message });
        return;
    }
});
exports.deleteBudget = deleteBudget;
// Get budgets with pagination
const getBudgets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Parse pagination parameters; default to page 1 and limit 10
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        // Optionally sort by year and month
        const budgets = yield Budget_1.default.find()
            .sort({ year: 1, month: 1 })
            .skip(skip)
            .limit(limit);
        const totalBudgets = yield Budget_1.default.countDocuments();
        const totalPages = Math.ceil(totalBudgets / limit);
        res.status(200).json({
            budgets,
            totalPages,
            currentPage: page,
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.getBudgets = getBudgets;
const getBudgetComparison = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Aggregate actual spending by category
        const actuals = yield Transaction_1.default.aggregate([
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" }
                }
            }
        ]);
        // Aggregate budget by category
        const budgets = yield Budget_1.default.aggregate([
            {
                $group: {
                    _id: "$category",
                    totalBudget: { $sum: "$budget" }
                }
            }
        ]);
        // Combine both results into a single array per category
        const categories = new Set([
            ...actuals.map((a) => a._id),
            ...budgets.map((b) => b._id)
        ]);
        const comparison = Array.from(categories).map((cat) => {
            const actualObj = actuals.find((a) => a._id === cat);
            const budgetObj = budgets.find((b) => b._id === cat);
            return {
                category: cat,
                actual: actualObj ? actualObj.total : 0,
                budget: budgetObj ? budgetObj.totalBudget : 0
            };
        });
        res.status(200).json(comparison);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.getBudgetComparison = getBudgetComparison;
