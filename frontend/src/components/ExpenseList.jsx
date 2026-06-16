export default function ExpenseList({
  expenses,
  deleteExpense,
}) {
  return (
    <div className="bg-white rounded shadow mt-5 p-5">
      <h2 className="text-xl font-semibold mb-4">
        Expenses
      </h2>

      {expenses.length === 0 ? (
        <p>No Expenses Found</p>
      ) : (
        expenses.map((expense) => (
          <div
            key={expense._id}
            className="flex justify-between border-b py-3"
          >
            <div>
              <h3 className="font-semibold">
                {expense.description}
              </h3>

              <p>{expense.category}</p>

              <p>
                ₹{expense.amount}
              </p>
            </div>

            <button
              onClick={() =>
                deleteExpense(expense._id)
              }
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}