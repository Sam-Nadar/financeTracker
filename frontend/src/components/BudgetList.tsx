// frontend/src/components/BudgetList.tsx

import React from 'react';

export interface Budget {
  _id: string;
  category: string;
  budget: number;
  month: number;
  year: number;
}

interface BudgetListProps {
  budgets: Budget[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const BudgetList: React.FC<BudgetListProps> = ({ budgets, onEdit, onDelete }) => {
  return (
    <div className="mt-5">
      {budgets.length === 0 ? (
        <p>No budgets found.</p>
      ) : (
        budgets.map((b) => (
          <div key={b._id} className="border border-gray-300 p-4 mb-4 rounded">
            <p>
              <strong>Category:</strong> {b.category}
            </p>
            <p>
              <strong>Budget:</strong> ${b.budget}
            </p>
            <p>
              <strong>Month:</strong> {b.month}
            </p>
            <p>
              <strong>Year:</strong> {b.year}
            </p>
            <div className="mt-2">
              <button
                onClick={() => onEdit(b._id)}
                className="mr-3 text-blue-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(b._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BudgetList;
