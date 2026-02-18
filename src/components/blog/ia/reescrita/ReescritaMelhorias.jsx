import React from "react";
import { CheckCircle } from "lucide-react";

export default function ReescritaMelhorias({ melhorias }) {
  if (!melhorias || melhorias.length === 0) return null;

  return (
    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
      <p className="text-xs font-bold text-green-900 mb-2">✨ Melhorias Aplicadas</p>
      <ul className="space-y-1">
        {melhorias.slice(0, 5).map((melhoria, i) => (
          <li key={i} className="text-xs text-gray-700 flex gap-2">
            <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span>{melhoria}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}