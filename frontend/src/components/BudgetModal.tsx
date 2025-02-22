// frontend/src/components/BudgetModal.tsx

import React from 'react';

interface BudgetModalProps {
  isOpen: boolean;
  editingBudgetId: string | null;
  category: string;
  budgetAmount: number | '';
  month: number;
  year: number;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: any) => void;
  monthOptions: { value: number; label: string }[];
  yearOptions: number[];
}

const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  editingBudgetId,
  category,
  budgetAmount,
  month,
  year,
  onClose,
  onSubmit,
  onChange,
  monthOptions,
  yearOptions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {editingBudgetId ? 'Edit Budget' : 'Add Budget'}
        </h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Category:</label>
            <select
              value={category}
              onChange={(e) => onChange('category', e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="Recurring">Recurring</option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Shopping">Shopping</option>
              <option value="Events">Events</option>
              <option value="Services">Services</option>
              <option value="Travel">Travel</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Budget Amount:
            </label>
            <input
              type="number"
              value={budgetAmount}
              onChange={(e) => onChange('budget', e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Month:</label>
            <select
              value={month}
              onChange={(e) => onChange('month', e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              {monthOptions.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Year:</label>
            <select
              value={year}
              onChange={(e) => onChange('year', e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {editingBudgetId ? 'Update' : 'Submit'}
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

export default BudgetModal;
