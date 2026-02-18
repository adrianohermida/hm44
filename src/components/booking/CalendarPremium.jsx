import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function CalendarPremium({ selectedDate, onDateChange, appointmentType }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const today = new Date();
  const minAdvanceDays = appointmentType === 'tecnica' ? 3 : 2;

  const isDateAvailable = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const daysDiff = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    return daysDiff >= minAdvanceDays && date.getDay() !== 0 && date.getDay() !== 6;
  };

  return (
    <div className="bg-[var(--bg-tertiary)] rounded-2xl p-6 border border-[var(--border-primary)]">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h3 className="font-bold text-[var(--text-primary)]">
          {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
          <div key={i} className="text-center text-xs font-semibold text-[var(--text-secondary)] py-2">
            {day}
          </div>
        ))}
        
        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isAvailable = isDateAvailable(day);
          const isSelected = selectedDate === dateStr;

          return (
            <button
              key={day}
              disabled={!isAvailable}
              onClick={() => isAvailable && onDateChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
              className={cn(
                "aspect-square rounded-lg text-sm font-medium transition-all",
                isSelected && "bg-[#0d9c6e] text-white",
                !isSelected && isAvailable && "bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:bg-[#0d9c6e]/10",
                !isAvailable && "opacity-30 cursor-not-allowed text-[var(--text-tertiary)]"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}