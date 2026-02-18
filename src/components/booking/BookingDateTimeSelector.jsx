import React from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CalendarPremium from "./CalendarPremium";

const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function BookingDateTimeSelector({ 
  selectedDate, 
  selectedSlot, 
  onDateChange, 
  onSlotChange, 
  onBack, 
  onNext, 
  appointmentType,
  theme 
}) {
  const availableSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Escolha o Horário
        </h2>
        <button 
          onClick={onBack} 
          className="text-[#0d9c6e] text-sm font-bold hover:underline flex items-center gap-1 min-h-[44px]"
        >
          <ArrowLeft size={16} /> Alterar Tipo
        </button>
      </div>

      <div className="space-y-4">
        <label className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Data da Consulta
        </label>
        <CalendarPremium
          selectedDate={selectedDate}
          onDateChange={(date) => onDateChange(date.toISOString().split('T')[0])}
          appointmentType={appointmentType}
        />
      </div>

      {selectedDate && (
        <div className="space-y-4 animate-fade-in">
          <label className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Horários Disponíveis
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {availableSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => onSlotChange(slot)}
                className={cn(
                  "py-3 rounded-xl border text-sm font-bold transition-all min-h-[44px]",
                  selectedSlot === slot 
                    ? "bg-[#0d9c6e] text-white border-[#0d9c6e] shadow-lg shadow-[#0d9c6e]/20" 
                    : theme === 'dark'
                    ? "bg-[#0a0f0d] border-white/10 hover:border-[#0d9c6e]/50 text-gray-300"
                    : "bg-white border-gray-200 hover:border-[#0d9c6e]/50 text-gray-700"
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      <Button
        disabled={!selectedSlot}
        onClick={onNext}
        className="w-full bg-[#0d9c6e] hover:bg-[#0a7d58] disabled:opacity-50 disabled:cursor-not-allowed text-white py-6 text-lg font-bold shadow-lg"
      >
        Próximo Passo
        <ChevronRight size={24} className="ml-2" />
      </Button>
    </div>
  );
}