import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CategoryChart from '../components/CategoryChart';
import TrendChart from '../components/TrendChart';
import BudgetChart from '../components/BudgetChart';
import { expenseAPI, authAPI } from '../services/api';

const DEFAULT_SPLITS = {
  Food: 8333,
  Transport: 8333,
  Entertainment: 8333,
  Utilities: 8333,
  Healthcare: 8333,
  Other: 8335,
};

const mergeWithDefaults = (loadedBudgets) => {
  if (!loadedBudgets || typeof loadedBudgets !== 'object' || Object.keys(loadedBudgets).length === 0) {
    return { ...DEFAULT_SPLITS };
  }
  const merged = { ...DEFAULT_SPLITS };
  Object.keys(DEFAULT_SPLITS).forEach(category => {
    if (loadedBudgets[category] !== undefined) {
      merged[category] = Number(loadedBudgets[category]);
    }
  });
  return merged;
};

const Analytics = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7));

  const [budgetLimit, setBudgetLimit] = useState(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        const currentMonth = new Date().toISOString().slice(0, 7);
        if (parsed.monthlyBudgets && parsed.monthlyBudgets[currentMonth]) {
          return parsed.monthlyBudgets[currentMonth].limit !== undefined 
            ? parsed.monthlyBudgets[currentMonth].limit 
            : 50000;
        }
        return parsed.budgetLimit !== undefined ? parsed.budgetLimit : 50000;
      } catch (e) {
        return 50000;
      }
    }
    return 50000;
  });

  const [categoryBudgets, setCategoryBudgets] = useState(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        const currentMonth = new Date().toISOString().slice(0, 7);
        if (parsed.monthlyBudgets && parsed.monthlyBudgets[currentMonth]) {
          return mergeWithDefaults(parsed.monthlyBudgets[currentMonth].splits);
        }
        if (parsed.categoryBudgets) {
          return mergeWithDefaults(parsed.categoryBudgets);
        }
      } catch (e) {}
    }
    return { ...DEFAULT_SPLITS };
  });

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  const loadMonthlyBudget = (month, userData) => {
    const userObj = userData || JSON.parse(localStorage.getItem("user"));
    if (userObj) {
      if (userObj.monthlyBudgets && userObj.monthlyBudgets[month]) {
        const config = userObj.monthlyBudgets[month];
        setBudgetLimit(config.limit !== undefined ? config.limit : 50000);
        setCategoryBudgets(mergeWithDefaults(config.splits));
        return;
      }
      // Fallback to defaults
      setBudgetLimit(userObj.budgetLimit !== undefined ? userObj.budgetLimit : 50000);
      setCategoryBudgets(mergeWithDefaults(userObj.categoryBudgets));
    }
  };

  const handleMonthChange = (newMonth) => {
    setSelectedMonth(newMonth);
    loadMonthlyBudget(newMonth);
  };

  const handleBudgetLimitChange = (newLimit) => {
    setBudgetLimit(newLimit);
    const evenShare = Math.floor(newLimit / 6);
    setCategoryBudgets({
      Food: evenShare,
      Transport: evenShare,
      Entertainment: evenShare,
      Utilities: evenShare,
      Healthcare: evenShare,
      Other: newLimit - evenShare * 5,
    });
  };

  const handleCategoryBudgetChange = (category, value) => {
    setCategoryBudgets((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  useEffect(() => {
    fetchExpenses();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getMe();
      const userData = response.data.data;
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        loadMonthlyBudget(selectedMonth, userData);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const saveBudgetSettings = async () => {
    if (isOverBudget) {
      setError("Cannot save: Total allocated budget exceeds the monthly limit.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSaveMessage(null);
      const response = await authAPI.updateBudget({
        budgetLimit,
        categoryBudgets,
        selectedMonth
      });
      localStorage.setItem("user", JSON.stringify(response.data.data));
      setSaveMessage("Budget settings saved successfully!");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      console.error("Error saving budget:", err);
      setError(err.response?.data?.message || "Failed to save budget settings");
    } finally {
      setSaving(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseAPI.getAll();
      setExpenses(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch expenses');
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const monthlyFilteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const [year, month] = selectedMonth.split('-');
    return (
      expenseDate.getFullYear() === parseInt(year) &&
      expenseDate.getMonth() === parseInt(month) - 1
    );
  });

  const calculateStats = () => {
    const stats = {
      totalExpenses: 0,
      totalByCategory: {},
      monthlyExpenses: {},
      topCategory: null,
      averageExpense: 0,
    };

    monthlyFilteredExpenses.forEach((expense) => {
      stats.totalExpenses += expense.amount;

      // By category
      if (!stats.totalByCategory[expense.category]) {
        stats.totalByCategory[expense.category] = 0;
      }
      stats.totalByCategory[expense.category] += expense.amount;

      // By month
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!stats.monthlyExpenses[monthKey]) {
        stats.monthlyExpenses[monthKey] = 0;
      }
      stats.monthlyExpenses[monthKey] += expense.amount;
    });

    // Find top category
    if (Object.keys(stats.totalByCategory).length > 0) {
      stats.topCategory = Object.entries(stats.totalByCategory).reduce((a, b) =>
        a[1] > b[1] ? a : b
      );
    }

    stats.averageExpense = monthlyFilteredExpenses.length > 0 ? stats.totalExpenses / monthlyFilteredExpenses.length : 0;

    return stats;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const stats = calculateStats();
  const totalAllocated = Object.values(categoryBudgets).reduce((sum, val) => sum + val, 0);
  const isOverBudget = totalAllocated > budgetLimit;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Analytics</h1>
            <p className="text-gray-600">Comprehensive spending analysis and insights</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Month Picker */}
            <div className="bg-white p-3 rounded-lg shadow-md flex items-center gap-3 border border-gray-150">
              <span className="text-sm font-semibold text-gray-700">Select Month:</span>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => handleMonthChange(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-gray-800"
              />
            </div>

            {/* Set Monthly Budget */}
            <div className="bg-white p-3 rounded-lg shadow-md flex items-center gap-3 border border-gray-150">
              <span className="text-sm font-semibold text-gray-700">Monthly Limit:</span>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-500 text-sm">₹</span>
                <input
                  type="number"
                  value={budgetLimit}
                  onChange={(e) => handleBudgetLimitChange(Number(e.target.value) || 0)}
                  className="w-36 pl-7 pr-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-gray-800"
                  placeholder="50000"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">Total Expenses</div>
            <div className="text-3xl font-bold text-gray-800">
              ₹{stats.totalExpenses.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-2">{expenses.length} transactions</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">Average Expense</div>
            <div className="text-3xl font-bold text-gray-800">
              ₹{stats.averageExpense.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-2">Per transaction</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">Top Category</div>
            <div className="text-3xl font-bold text-gray-800">
              {stats.topCategory ? stats.topCategory[0] : 'N/A'}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              ₹{stats.topCategory ? stats.topCategory[1].toFixed(2) : '0.00'}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">Budget Status</div>
            <div className="text-3xl font-bold text-gray-800">
              {((stats.totalExpenses / budgetLimit) * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-500 mt-2">Of ₹{budgetLimit.toFixed(2)}</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CategoryChart expenses={monthlyFilteredExpenses} />
          <TrendChart expenses={expenses} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <BudgetChart expenses={monthlyFilteredExpenses} categoryBudgets={categoryBudgets} />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between border border-gray-200">
            <div>
              <h2 className="text-xl font-bold mb-2 text-gray-800">Category Budgets</h2>
              <p className="text-xs text-gray-500 mb-4">Customize how you divide your monthly budget limit.</p>
              
              {/* Allocation Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className={isOverBudget ? "text-red-600" : "text-gray-600"}>
                    Allocated: ₹{totalAllocated.toLocaleString('en-IN')} / ₹{budgetLimit.toLocaleString('en-IN')}
                  </span>
                  <span className={isOverBudget ? "text-red-600" : "text-blue-600"}>
                    {budgetLimit > 0 ? ((totalAllocated / budgetLimit) * 100).toFixed(0) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${isOverBudget ? "bg-red-500" : "bg-blue-500"}`}
                    style={{ width: `${Math.min(budgetLimit > 0 ? (totalAllocated / budgetLimit) * 100 : 0, 100)}%` }}
                  ></div>
                </div>
                {isOverBudget && (
                  <p className="text-xs text-red-500 font-semibold mt-1">
                    ⚠️ Total allocated exceeds monthly budget by ₹{(totalAllocated - budgetLimit).toLocaleString('en-IN')}!
                  </p>
                )}
              </div>

              {/* Inputs */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {Object.keys(categoryBudgets).map((category) => (
                  <div key={category} className="flex justify-between items-center gap-2">
                    <label className="text-xs font-semibold text-gray-600 w-24 truncate">{category}</label>
                    <div className="relative flex items-center w-full">
                      <span className="absolute left-2 text-gray-500 text-xs">₹</span>
                      <input
                        type="number"
                        value={categoryBudgets[category]}
                        onChange={(e) => handleCategoryBudgetChange(category, Number(e.target.value) || 0)}
                        className={`w-full pl-5 pr-2 py-1 border rounded text-xs text-gray-800 font-medium focus:outline-none focus:ring-1 ${isOverBudget ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                        min="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
              {/* Save Button */}
              <div className="mt-4 pt-3 border-t border-gray-150 flex flex-col gap-2">
                {saveMessage && (
                  <div className="text-xs text-green-600 font-semibold text-center bg-green-50 py-1.5 rounded border border-green-200 animate-fade-in">
                    {saveMessage}
                  </div>
                )}
                <button
                  type="button"
                  disabled={saving || isOverBudget}
                  onClick={saveBudgetSettings}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-2 px-4 rounded-lg text-xs transition duration-200 shadow-sm"
                >
                  {saving ? "Saving..." : "Save Budget Settings"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Category Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Transactions
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.totalByCategory).map(([category, total]) => {
                  const count = monthlyFilteredExpenses.filter((e) => e.category === category).length;
                  const percentage = ((total / stats.totalExpenses) * 100).toFixed(1);
                  return (
                    <tr key={category} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                        ₹{total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{count}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-600">{percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Analytics;
