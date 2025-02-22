"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const budgetRoutes_1 = __importDefault(require("./routes/budgetRoutes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API Routes
app.use('/api/transactions', transactionRoutes_1.default);
app.use('/api/budgets', budgetRoutes_1.default);
exports.default = app;
