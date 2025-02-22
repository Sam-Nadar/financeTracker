"use strict";
// backend/src/services/transactionService.ts
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
exports.deleteTransaction = exports.updateTransaction = exports.getTransactions = exports.createTransaction = void 0;
const Transaction_1 = __importDefault(require("../models/Transaction"));
/**
 * Create a new transaction.
 * @param data Partial transaction data
 * @returns The created transaction document
 */
function createTransaction(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const transaction = new Transaction_1.default(data);
        return yield transaction.save();
    });
}
exports.createTransaction = createTransaction;
/**
 * Retrieve all transactions.
 * @returns An array of transaction documents
 */
function getTransactions() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Transaction_1.default.find();
    });
}
exports.getTransactions = getTransactions;
/**
 * Update an existing transaction.
 * @param id Transaction ID
 * @param data Partial data to update
 * @returns The updated transaction document, or null if not found
 */
function updateTransaction(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Transaction_1.default.findByIdAndUpdate(id, data, { new: true });
    });
}
exports.updateTransaction = updateTransaction;
/**
 * Delete a transaction.
 * @param id Transaction ID
 */
function deleteTransaction(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Transaction_1.default.findByIdAndDelete(id);
    });
}
exports.deleteTransaction = deleteTransaction;
