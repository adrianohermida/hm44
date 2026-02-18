import React from "react";
import { MessageSquare, Scale } from "lucide-react";

export default function BookingTypeSelector({ onSelect, theme }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        O que você precisa?
      </h2>
      <div className="space-y-4">
        <button
          onClick={() => onSelect('avaliacao')}
          className={`w-full flex items-start gap-4 p-6 rounded-2xl border transition-all text-left group min-h-[56px] ${
            theme === 'dark'
              ? 'border-white/5 bg-[#0a0f0d] hover:border-[#0d9c6e]/50 hover:bg-[#0d9c6e]/5'
              : 'border-gray-200 bg-gray-50 hover:border-[#0d9c6e]/50 hover:bg-[#0d9c6e]/5'
          }`}
        >
          <div className="bg-[#0d9c6e]/10 p-3 rounded-xl group-hover:bg-[#0d9c6e]/20 transition-colors">
            <MessageSquare className="text-[#0d9c6e]" size={24} />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Avaliação de Caso Inicial
            </h3>
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Para novos clientes que buscam orientação sobre superendividamento ou dívidas bancárias.
            </p>
            <p className="text-[#0d9c6e] text-xs font-bold mt-2 uppercase tracking-wider">
              Gratuito • Antecedência 48h
            </p>
          </div>
        </button>

        <button
          onClick={() => onSelect('tecnica')}
          className={`w-full flex items-start gap-4 p-6 rounded-2xl border transition-all text-left group min-h-[56px] ${
            theme === 'dark'
              ? 'border-white/5 bg-[#0a0f0d] hover:border-[#0d9c6e]/50 hover:bg-[#0d9c6e]/5'
              : 'border-gray-200 bg-gray-50 hover:border-[#0d9c6e]/50 hover:bg-[#0d9c6e]/5'
          }`}
        >
          <div className="bg-[#0d9c6e]/10 p-3 rounded-xl group-hover:bg-[#0d9c6e]/20 transition-colors">
            <Scale className="text-[#0d9c6e]" size={24} />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Consulta Técnica / Processual
            </h3>
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Análise de autos, dúvidas sobre processos em andamento ou pareceres técnicos.
            </p>
            <p className="text-[#0d9c6e] text-xs font-bold mt-2 uppercase tracking-wider">
              Sujeito a Honorários • Antecedência 72h
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}