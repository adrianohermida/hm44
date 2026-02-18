import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function DiagnosticoCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
    blue: "from-blue-500 to-blue-600",
    orange: "from-orange-500 to-orange-600"
  };

  const bgColors = {
    green: "bg-green-50",
    red: "bg-red-50",
    blue: "bg-blue-50",
    orange: "bg-orange-50"
  };

  const textColors = {
    green: "text-green-600",
    red: "text-red-600",
    blue: "text-blue-600",
    orange: "text-orange-600"
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
          </div>
          <div className={`p-3 rounded-xl ${bgColors[color]}`}>
            <Icon className={`w-6 h-6 ${textColors[color]}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}