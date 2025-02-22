// frontend/src/components/TransactionModal.tsx

import React from 'react';

interface TransactionModalProps {
  isOpen: boolean;
  editingTransactionId: string | null;
  description: string;
  amount: number | '';
  date: string;
  category: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: any) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  editingTransactionId,
  description,
  amount,
  date,
  category,
  onClose,
  onSubmit,
  onChange,
}) => {
  // If needed, you can also handle local state here

  // Prevent scroll when modal is open, etc.

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {editingTransactionId ? 'Edit Transaction' : 'Add Transaction'}
        </h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description (max 15 words):
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => onChange('description', e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => onChange('amount', Number(e.target.value))}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => onChange('date', e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Category:</label>
            <select
              value={category}
              onChange={(e) => onChange('category', e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="Recurring">Recurring</option>
              <option value="Transportation">Transportation</option>
              <option value="Food">Food</option>
              <option value="Shopping">Shopping</option>
              <option value="Services">Services</option>
              <option value="Travel">Travel</option>
              <option value="Events">Events</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {editingTransactionId ? 'Update' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
