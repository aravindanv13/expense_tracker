import React from 'react';

const SummaryCard = ({ title, amount }) => {
  // Determine color gradient based on title
  let cardStyle = "bg-gradient-to-br from-blue-500 to-blue-600";
  if (title.toLowerCase().includes("entries") || title.toLowerCase().includes("transactions")) {
    cardStyle = "bg-gradient-to-br from-green-500 to-green-600";
  } else if (title.toLowerCase().includes("categories")) {
    cardStyle = "bg-gradient-to-br from-purple-500 to-purple-600";
  }

  return (
    <div className={`${cardStyle} rounded-lg shadow-md p-6 text-white transition-transform duration-200 hover:scale-105`}>
      <div className="text-sm font-medium opacity-90 uppercase tracking-wider">{title}</div>
      <div className="text-3xl font-bold mt-2">
        {typeof amount === 'number' && title.toLowerCase().includes('expense') 
          ? `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
          : amount}
      </div>
    </div>
  );
};

export default SummaryCard;
