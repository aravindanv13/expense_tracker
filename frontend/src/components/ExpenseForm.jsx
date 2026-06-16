import { useState } from "react";
import { expenseAPI } from "../services/api";

export default function ExpenseForm({ fetchExpenses }) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: "",
    notes: "",
    paymentMethod: "Cash",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!formData.description || !formData.amount || !formData.category) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await expenseAPI.create(formData);

      setFormData({
        description: "",
        amount: "",
        category: "",
        date: "",
        notes: "",
        paymentMethod: "Cash",
      });

      fetchExpenses();
    } catch (err) {
      console.error("Error creating expense:", err);
      setError(err.response?.data?.message || "Failed to create expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="bg-white p-5 rounded shadow mt-5"
    >
      <h2 className="text-xl font-semibold mb-4">
        Add Expense
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          name="description"
          placeholder="Expense Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="border p-2 rounded"
          step="0.01"
          min="0"
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Utilities">Utilities</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="notes"
          placeholder="Notes (optional)"
          value={formData.notes}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="Cash">Cash</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
          <option value="UPI">UPI</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-blue-600 text-white px-5 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? "Adding..." : "Add Expense"}
      </button>
    </form>
  );
}