import React from "react";

export default function ScoreDisplay({ total }) {
  const color = total >= 80 ? 'text-green-600' : 
                total >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg border mb-3 text-center">
      <p className="text-xs sm:text-sm text-gray-600 mb-1">Score Total</p>
      <p className={`text-3xl sm:text-4xl font-bold ${color}`} role="status" aria-live="polite">
        {total}
        <span className="text-lg sm:text-xl text-gray-500">/100</span>
      </p>
    </div>
  );
}