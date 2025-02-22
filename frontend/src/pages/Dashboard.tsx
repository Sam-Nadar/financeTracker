// frontend/src/pages/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import Navbar from '../components/Navbar'; // Import the navbar
import { BASE_URL } from '@/App';

interface Transaction {
  _id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface CategoryBreakdown {
  category: string;
  total: number;
}


const Dashboard: React.FC = () => {
  // State for recent transactions, category breakdown, and overall total expense.
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryBreakdown[]>([]);
  const [overallTotal, setOverallTotal] = useState<number>(0);

  // Fetch data on component mount.
  useEffect(() => {
    fetchRecentTransactions();
    fetchCategoryBreakdown();
  }, []);

  // Fetch 5 most recent transactions.
  const fetchRecentTransactions = async () => {
    try {
      // Assumes backend endpoint returns an array of transactions sorted descending by date.
      const response = await axios.get<Transaction[]>(`${BASE_URL}/api/transactions/recent?limit=5`);
      setRecentTransactions(response.data);
    } catch (error: any) {
      toast.error(`Error fetching recent transactions: ${error.message}`);
    }
  };

  // Fetch category breakdown and calculate overall total expense.
  const fetchCategoryBreakdown = async () => {
    try {
      const response = await axios.get<CategoryBreakdown[]>(`${BASE_URL}/api/transactions/category-breakdown`);
      setCategoryData(response.data);
      const total = response.data.reduce((sum, item) => sum + item.total, 0);
      setOverallTotal(total);
    } catch (error: any) {
      toast.error(`Error fetching category breakdown: ${error.message}`);
    }
  };

  // Colors for the pie chart slices.
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA00FF', '#FF6699', '#66CCFF'];

  return (
    <>
      <Navbar />
      <div className="p-5">
        <Toaster />
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-semibold">Overall Total Expenses</h2>
            <p className="text-2xl font-bold">${overallTotal.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Category Breakdown</h2>
            <ul>
              {categoryData.map((item) => (
                <li key={item.category} className="flex justify-between py-1">
                  <span>{item.category}</span>
                  <span>${item.total.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Category-wise Pie Chart */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Expense Distribution by Category</h2>
          <div className="w-full h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5 Most Recent Transactions Table */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">5 Most Recent Transactions</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Category</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.map((tx) => (
                <tr key={tx._id}>
                  <td className="px-4 py-2 text-sm text-gray-900">{tx.description}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">${tx.amount.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">{tx.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
