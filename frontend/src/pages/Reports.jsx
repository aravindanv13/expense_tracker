import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { expenseAPI } from '../services/api';

const Reports = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseAPI.getAll();
      setExpenses(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const getMonthExpenses = () => {
    const [year, month] = selectedMonth.split('-');
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getFullYear() === parseInt(year) &&
        expenseDate.getMonth() === parseInt(month) - 1
      );
    });
  };

  const generateMonthlyReport = () => {
    const monthExpenses = getMonthExpenses();
    const categories = {};

    monthExpenses.forEach((expense) => {
      if (!categories[expense.category]) {
        categories[expense.category] = {
          total: 0,
          count: 0,
          items: [],
        };
      }
      categories[expense.category].total += expense.amount;
      categories[expense.category].count += 1;
      categories[expense.category].items.push(expense);
    });

    return {
      totalExpense: monthExpenses.reduce((sum, exp) => sum + exp.amount, 0),
      categories,
      itemCount: monthExpenses.length,
    };
  };

  const downloadReport = () => {
    const report = generateMonthlyReport();
    const [year, month] = selectedMonth.split('-');
    const monthName = new Date(year, month - 1).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });

    let csvContent = `Expense Tracker - Monthly Report\n${monthName}\n\n`;
    csvContent += `Total Expenses: ₹${report.totalExpense.toFixed(2)}\nTotal Transactions: ${report.itemCount}\n\n`;
    csvContent += `Category,Amount,Count\n`;

    Object.entries(report.categories).forEach(([category, data]) => {
      csvContent += `${category},₹${data.total.toFixed(2)},${data.count}\n`;
    });

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`);
    element.setAttribute('download', `Super_PACC_Report_${monthName.replace(' ', '_')}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const report = generateMonthlyReport();
  const [year, month] = selectedMonth.split('-');
  const monthName = new Date(year, month - 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Reports</h1>
          <p className="text-gray-600">Generate and view expense reports</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Report Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-end md:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Month
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={downloadReport}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              Download CSV
            </button>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{monthName}</h2>
            <p className="text-gray-600">Monthly expense summary</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-sm text-gray-600 mb-2">Total Expenses</div>
              <div className="text-3xl font-bold text-blue-600">
                ₹{report.totalExpense.toFixed(2)}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-sm text-gray-600 mb-2">Transactions</div>
              <div className="text-3xl font-bold text-green-600">{report.itemCount}</div>
            </div>
          </div>

          {/* Category Details */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                    Count
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                    Avg
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(report.categories).map(([category, data]) => (
                  <tr key={category} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {category}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 font-semibold">
                      ₹{data.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600">{data.count}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600">
                      ₹{(data.total / data.count).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Expenses for Month */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">Detailed Expenses</h3>
          </div>
          {getMonthExpenses().length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <p>No expenses for this month</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Category
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getMonthExpenses().map((expense) => (
                    <tr key={expense._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">{expense.description}</td>
                      <td className="px-6 py-3 text-sm">
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-right font-semibold text-gray-900">
                        ₹{expense.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default Reports;
