import React from "react";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

export default function ScoreDetailBadge({ label, score, max }) {
  const percentage = (score / max) * 100;
  const Icon = percentage >= 80 ? CheckCircle : percentage >= 50 ? AlertCircle : XCircle;
  const color = percentage >= 80 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="flex items-center justify-between p-2 bg-white rounded border">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} aria-hidden="true" />
        <span className="text-xs sm:text-sm font-medium">{label}</span>
      </div>
      <span className={`text-xs sm:text-sm font-bold ${color}`}>
        {score}/{max}
      </span>
    </div>
  );
}