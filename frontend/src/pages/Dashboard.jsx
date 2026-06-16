import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import SummaryCard from "../components/SummaryCard";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import { expenseAPI } from "../services/api";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await expenseAPI.getAll();
      setExpenses(response.data.data || []);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError(err.response?.data?.message || "Failed to fetch expenses");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await expenseAPI.delete(id);
      fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError(err.response?.data?.message || "Failed to delete expense");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchExpenses();
  }, [navigate]);

  const totalExpense =
    expenses.reduce(
      (acc, curr) =>
        acc + Number(curr.amount),
      0
    );

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto p-5 text-center">
          <p className="text-gray-600">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto p-5">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          <SummaryCard
            title="Total Expense"
            amount={totalExpense}
          />

          <SummaryCard
            title="Total Entries"
            amount={expenses.length}
          />

          <SummaryCard
            title="Categories"
            amount={
              new Set(
                expenses.map(
                  (e) => e.category
                )
              ).size
            }
          />
        </div>

        <ExpenseForm
          fetchExpenses={fetchExpenses}
        />

        <ExpenseList
          expenses={expenses}
          deleteExpense={deleteExpense}
        />
      </div>
    </div>
  );
}