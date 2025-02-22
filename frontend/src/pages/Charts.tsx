import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Navbar from "../components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { BASE_URL } from "@/App";

interface MonthlyExpense {
  month: number;
  amount: number;
}

interface BudgetComparisonData {
  category: string;
  actual: number;
  budget: number;
}

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const ChartsPage: React.FC = () => {
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpense[]>([]);
  const [budgetComparison, setBudgetComparison] = useState<
    BudgetComparisonData[]
  >([]);

  useEffect(() => {
    fetchMonthlyExpenses();
    fetchBudgetComparison();
  }, []);

  const fetchMonthlyExpenses = async () => {
    try {
      const response = await axios.get<MonthlyExpense[]>(
        `${BASE_URL}/api/transactions/monthly-expenses`
      );
      console.log("Fetched monthly expenses:", response.data);
      setMonthlyExpenses(response.data);
    } catch (error: any) {
      toast.error(`Error fetching monthly expenses: ${error.message}`);
    }
  };

  const fetchBudgetComparison = async () => {
    try {
      const response = await axios.get<BudgetComparisonData[]>(
        `${BASE_URL}/api/budgets/comparison`
      );
      console.log("Fetched budget comparison:", response.data);
      setBudgetComparison(response.data);
    } catch (error: any) {
      toast.error(`Error fetching budget comparison: ${error.message}`);
    }
  };

  // Calculate simple spending insights
  const totalSpent = monthlyExpenses.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const averageMonthly =
    monthlyExpenses.length > 0 ? totalSpent / monthlyExpenses.length : 0;
  const insights = [
    `Total spent this year: $${totalSpent.toFixed(2)}`,
    `Average monthly spending: $${averageMonthly.toFixed(2)}`,
  ];

  // Colors for the comparison chart
  const COLORS = ["#8884d8", "#82ca9d"];

  return (
    <>
      <Navbar />
      <div className="p-5">
        <Toaster />
        <h1 className="text-2xl font-bold mb-4">Charts & Spending Insights</h1>

        {/* Monthly Expenses Bar Chart */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Monthly Expenses</h2>
          <div className="w-full h-64">
            <ResponsiveContainer>
              <BarChart
                layout="vertical"
                data={monthlyExpenses}
                margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  label={{
                    value: "Amount Spent ($)",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  type="category"
                  dataKey="month"
                  tickFormatter={(month) => monthLabels[month - 1]}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget vs Actual Comparison Chart */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            Budget vs Actual Comparison
          </h2>
          <div className="w-full h-64">
            <ResponsiveContainer>
              <BarChart
                data={budgetComparison}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis
                  label={{
                    value: "Amount ($)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="budget" fill={COLORS[0]} name="Budget" />
                <Bar dataKey="actual" fill={COLORS[1]} name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending Insights */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Spending Insights</h2>
          <ul className="list-disc list-inside">
            {insights.map((insight, index) => (
              <li key={index} className="text-xl text-gray-700">
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ChartsPage;
