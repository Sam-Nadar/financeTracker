"use strict";
// backend/src/services/budgetService.ts
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
exports.getBudgets = exports.createOrUpdateBudget = void 0;
const Budget_1 = __importDefault(require("../models/Budget"));
/**
 * Create a new budget or update an existing one for a given category and period.
 * @param data Partial budget data (should include category, month, year, and budget)
 * @returns The created or updated budget document
 * @throws Error if required fields are missing.
 */
function createOrUpdateBudget(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { category, month, year, budget } = data;
        // Validate required fields
        if (!category || month == null || year == null || budget == null) {
            throw new Error('Missing required fields: category, month, year, or budget.');
        }
        // Check for an existing budget for the given category, month, and year
        const existingBudget = yield Budget_1.default.findOne({ category, month, year });
        if (existingBudget) {
            existingBudget.budget = budget;
            return yield existingBudget.save();
        }
        // Otherwise, create a new budget entry
        const newBudget = new Budget_1.default(data);
        return yield newBudget.save();
    });
}
exports.createOrUpdateBudget = createOrUpdateBudget;
/**
 * Retrieve all budgets.
 * @returns An array of budget documents
 */
function getBudgets() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Budget_1.default.find();
    });
}
exports.getBudgets = getBudgets;
