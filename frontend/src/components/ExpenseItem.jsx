import React from 'react';

const ExpenseItem = ({ expense, onEdit, onDelete, getCategoryColor }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition duration-150">
      <td className="px-6 py-4 text-sm text-gray-900">
        <div className="font-medium">{expense.description}</div>
        <div className="text-xs text-gray-500">{expense.notes || '-'}</div>
      </td>
      <td className="px-6 py-4 text-sm">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
            expense.category
          )}`}
        >
          {expense.category}
        </span>
      </td>
      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
        ₹{expense.amount.toFixed(2)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {formatDate(expense.date)}
      </td>
      <td className="px-6 py-4 text-sm space-x-3">
        <button
          onClick={() => onEdit(expense)}
          className="text-blue-500 hover:text-blue-700 hover:underline font-medium transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(expense._id)}
          className="text-red-500 hover:text-red-700 hover:underline font-medium transition"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ExpenseItem;
