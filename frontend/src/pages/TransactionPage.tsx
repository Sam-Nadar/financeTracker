// frontend/src/pages/TransactionPage.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa';
import TransactionList from "../components/TransactionalList";
import TransactionModal from '../components/TransactionalModal';
import Navbar from '../components/Navbar'; // Import the navbar
import { BASE_URL } from '@/App';

interface Transaction {
  _id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface TransactionResponse {
  transactions: Transaction[];
  totalPages: number;
  currentPage: number;
}

const TransactionPage: React.FC = () => {
  // List state & pagination
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState<string>('');
  const [category, setCategory] = useState<string>('Recurring');
  // Track the ID of a transaction being edited (null means adding a new transaction)
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);

  // Set today's date as default (formatted as YYYY-MM-DD)
  useEffect(() => {
    setDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Fetch transactions whenever the page changes
  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  // Fetch transactions from backend with pagination parameters
  const fetchTransactions = async (page: number) => {
    try {
      const response = await axios.get<TransactionResponse>(`${BASE_URL}/api/transactions?page=${page}&limit=10`);
      console.log('Fetched transactions:', response.data.transactions);
      setTransactions(response.data.transactions);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      toast.error(`Error fetching transactions: ${error.message}`);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('Recurring');
  };

  // Open and close modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
    setEditingTransactionId(null);
  };

  // Handle form submission with basic validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date || !category) {
      toast.error('All fields are required');
      return;
    }
    const wordCount = description.trim().split(/\s+/).length;
    if (wordCount > 15) {
      toast.error('Description must be 15 words or fewer');
      return;
    }
    const payload = { description, amount, date, category };

    try {
      if (editingTransactionId) {
        // Edit mode: update existing transaction
        const response = await axios.put(`${BASE_URL}/api/transactions/${editingTransactionId}`, payload);
        if (response.status === 200) {
          toast.success('Transaction updated successfully!');
          closeModal();
          fetchTransactions(page);
        }
      } else {
        // Add mode: create new transaction
        const response = await axios.post(`${BASE_URL}/api/transactions/`, payload);
        if (response.status === 200 || response.status === 201) {
          toast.success('Transaction added successfully!');
          closeModal();
          fetchTransactions(page);
        }
      }
    } catch (error: any) {
      toast.error(`Failed to save transaction: ${error.response?.data?.error || error.message}`);
    }
  };

  // Delete a transaction
  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/transactions/${id}`);
      if (response.status === 200) {
        toast.success('Transaction deleted successfully');
        fetchTransactions(page);
      }
    } catch (error: any) {
      toast.error(`Failed to delete transaction: ${error.response?.data?.error || error.message}`);
    }
  };

  // Edit functionality: prefill the form with the selected transaction's data
  const handleEdit = (id: string) => {
    const transactionToEdit = transactions.find((t) => t._id === id);
    if (!transactionToEdit) {
      toast.error('Transaction not found');
      return;
    }
    setDescription(transactionToEdit.description);
    setAmount(transactionToEdit.amount);
    setDate(new Date(transactionToEdit.date).toISOString().split('T')[0]);
    setCategory(transactionToEdit.category);
    setEditingTransactionId(id);
    openModal();
  };

  // Render pagination controls
  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          disabled={i === page}
          className={`px-3 py-1 border rounded ${
            i === page ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
          }`}
        >
          {i}
        </button>
      );
    }
    return (
      <div className="mt-5 flex items-center space-x-2">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 border rounded bg-white text-blue-500"
        >
          Prev
        </button>
        {pages}
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded bg-white text-blue-500"
        >
          Next
        </button>
      </div>
    );
  };

  // Helper function for updating form fields
  const handleFormChange = (field: string, value: any) => {
    if (field === 'description') setDescription(value);
    if (field === 'amount') setAmount(value);
    if (field === 'date') setDate(value);
    if (field === 'category') setCategory(value);
  };

  return (
    <>
      <Navbar />
      <div className="p-5">
        <Toaster />
        <h1 className="text-2xl font-bold mb-4">Transaction List</h1>
        <button
          onClick={() => {
            resetForm();
            setEditingTransactionId(null);
            openModal();
          }}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <FaPlus /> Add Transaction
        </button>

        <TransactionList transactions={transactions} onEdit={handleEdit} onDelete={handleDelete} />

        {renderPagination()}

        <TransactionModal
          isOpen={isModalOpen}
          editingTransactionId={editingTransactionId}
          description={description}
          amount={amount}
          date={date}
          category={category}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onChange={handleFormChange}
        />
      </div>
    </>
  );
};

export default TransactionPage;
