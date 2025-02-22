// frontend/src/components/TransactionList.tsx

import React from 'react';

interface Transaction {
  _id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface TransactionListProps {
  transactions?: Transaction[]; // Marked as optional
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions = [], // Default to empty array if undefined
  onEdit,
  onDelete,
  
}) => {
  return (
    <div className="mt-5">
        
      {transactions.map((t) => (
        <div key={t._id} className="border border-gray-300 p-4 mb-4 rounded">
          <p>
            <strong>Description:</strong> {t.description}
          </p>
          <p>
            <strong>Amount:</strong> {t.amount}
          </p>
          <p>
            <strong>Date:</strong> {new Date(t.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Category:</strong> {t.category}
          </p>
          <div className="mt-2">
            <button onClick={() => onEdit(t._id)} className="mr-3 text-blue-500 hover:underline">
              Edit
            </button>
            <button onClick={() => onDelete(t._id)} className="text-red-500 hover:underline">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
