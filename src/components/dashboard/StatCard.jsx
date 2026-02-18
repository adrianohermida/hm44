import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function StatCard({ label, value, icon: Icon, bgColor, iconColor }) {
  return (
    <Card className={`${bgColor} border-[var(--border-primary)]`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[var(--text-secondary)] text-xs md:text-sm font-medium">
              {label}
            </p>
            <p className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mt-1">
              {value}
            </p>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center">
            <Icon className={`w-5 h-5 md:w-6 md:h-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}