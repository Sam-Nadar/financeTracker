// frontend/src/pages/BudgetPage.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import BudgetList, { Budget } from '../components/BudgetList';
import BudgetModal from '../components/BudgetModal';
import { BASE_URL } from '@/App';

interface BudgetResponse {
  budgets: Budget[];
  totalPages: number;
  currentPage: number;
}

const BudgetPage: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [category, setCategory] = useState<string>('Recurring');
  const [budgetAmount, setBudgetAmount] = useState<number | ''>('');
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);

  // Define month and year options
  const monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];
  const yearOptions: number[] = [];
  for (let y = 2020; y <= 2040; y++) {
    yearOptions.push(y);
  }

  useEffect(() => {
    fetchBudgets(page);
  }, [page]);

  const fetchBudgets = async (page: number) => {
    try {
      const response = await axios.get<BudgetResponse>(
        `${BASE_URL}/api/budgets?page=${page}&limit=10`
      );
      console.log('Fetched budgets:', response.data.budgets);
      setBudgets(response.data.budgets);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      toast.error(`Error fetching budgets: ${error.message}`);
    }
  };

  const resetForm = () => {
    setCategory('Recurring');
    setBudgetAmount('');
    setMonth(new Date().getMonth() + 1);
    setYear(new Date().getFullYear());
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
    setEditingBudgetId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !budgetAmount || !month || !year) {
      toast.error('All fields are required');
      return;
    }
    const payload = { category, budget: budgetAmount, month, year };

    try {
      if (editingBudgetId) {
        const response = await axios.put(
          `${BASE_URL}/api/budgets/${editingBudgetId}`,
          payload
        );
        if (response.status === 200) {
          toast.success('Budget updated successfully!');
          closeModal();
          fetchBudgets(page);
        }
      } else {
        const response = await axios.post(`${BASE_URL}/api/budgets`, payload);
        if (response.status === 200 || response.status === 201) {
          toast.success('Budget added successfully!');
          closeModal();
          fetchBudgets(page);
        }
      }
    } catch (error: any) {
      toast.error(`Failed to save budget: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/budgets/${id}`);
      if (response.status === 200) {
        toast.success('Budget deleted successfully');
        fetchBudgets(page);
      }
    } catch (error: any) {
      toast.error(`Failed to delete budget: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleEdit = (id: string) => {
    const budgetToEdit = budgets.find((b) => b._id === id);
    if (!budgetToEdit) {
      toast.error('Budget not found');
      return;
    }
    setCategory(budgetToEdit.category);
    setBudgetAmount(budgetToEdit.budget);
    setMonth(budgetToEdit.month);
    setYear(budgetToEdit.year);
    setEditingBudgetId(id);
    openModal();
  };

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

  const handleFormChange = (field: string, value: any) => {
    if (field === 'category') setCategory(value);
    if (field === 'budget') setBudgetAmount(Number(value));
    if (field === 'month') setMonth(Number(value));
    if (field === 'year') setYear(Number(value));
  };

  return (
    <>
      <Navbar />
      <div className="p-5">
        <Toaster />
        <h1 className="text-2xl font-bold mb-4">Budget List</h1>
        <button
          onClick={() => {
            resetForm();
            setEditingBudgetId(null);
            openModal();
          }}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <FaPlus /> Add Budget
        </button>

        <BudgetList budgets={budgets} onEdit={handleEdit} onDelete={handleDelete} />

        {renderPagination()}

        <BudgetModal
          isOpen={isModalOpen}
          editingBudgetId={editingBudgetId}
          category={category}
          budgetAmount={budgetAmount}
          month={month}
          year={year}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onChange={handleFormChange}
          monthOptions={monthOptions}
          yearOptions={yearOptions}
        />
      </div>
    </>
  );
};

export default BudgetPage;
