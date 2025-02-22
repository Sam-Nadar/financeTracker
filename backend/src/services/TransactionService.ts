// backend/src/services/transactionService.ts

import Transaction, { ITransaction } from '../models/Transaction';

/**
 * Create a new transaction.
 * @param data Partial transaction data
 * @returns The created transaction document
 */
export async function createTransaction(data: Partial<ITransaction>): Promise<ITransaction> {
  const transaction = new Transaction(data);
  return await transaction.save();
}

/**
 * Retrieve all transactions.
 * @returns An array of transaction documents
 */
export async function getTransactions(): Promise<ITransaction[]> {
  return await Transaction.find();
}

/**
 * Update an existing transaction.
 * @param id Transaction ID
 * @param data Partial data to update
 * @returns The updated transaction document, or null if not found
 */
export async function updateTransaction(
  id: string,
  data: Partial<ITransaction>
): Promise<ITransaction | null> {
  return await Transaction.findByIdAndUpdate(id, data, { new: true });
}

/**
 * Delete a transaction.
 * @param id Transaction ID
 */
export async function deleteTransaction(id: string): Promise<void> {
  await Transaction.findByIdAndDelete(id);
}
