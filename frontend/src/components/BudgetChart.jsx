import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const BudgetChart = ({ expenses, categoryBudgets }) => {
  const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Other'];

  // Calculate spending by category for all standard categories
  const categoryData = CATEGORIES.map(category => {
    const spent = expenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      category,
      spent,
      budget: categoryBudgets[category] || 0
    };
  });

  if (categoryData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-96 flex items-center justify-center">
        <p className="text-gray-500">No expense data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Budget vs Actual</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={categoryData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
          <Legend />
          <Bar dataKey="spent" fill="#3B82F6" name="Spent" />
          <Bar dataKey="budget" fill="#10B981" name="Budget" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetChart;
