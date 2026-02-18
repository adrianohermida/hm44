import React from "react";
import { ArrowLeft, CheckCircle2, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function BookingFormFields({ 
  formData, 
  onChange, 
  onSubmit, 
  onBack, 
  loading, 
  selectedDate, 
  selectedSlot, 
  appointmentType,
  theme 
}) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Seus Dados
        </h2>
        <button 
          onClick={onBack} 
          className="text-[#0d9c6e] text-sm font-bold hover:underline flex items-center gap-1 min-h-[44px]"
        >
          <ArrowLeft size={16} /> Alterar Horário
        </button>
      </div>

      <div className={`p-6 rounded-2xl border flex items-center gap-4 ${
        theme === 'dark'
          ? 'bg-[#0d9c6e]/5 border-[#0d9c6e]/20'
          : 'bg-[#0d9c6e]/5 border-[#0d9c6e]/30'
      }`}>
        <div className="bg-[#0d9c6e]/20 p-3 rounded-xl">
          <CalendarIcon className="text-[#0d9c6e]" size={24} />
        </div>
        <div>
          <p className={`text-xs uppercase font-bold tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Resumo do Agendamento
          </p>
          <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {new Date(selectedDate).toLocaleDateString('pt-BR')} às {selectedSlot}
          </p>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
            {appointmentType === 'tecnica' ? 'Consulta Técnica' : 'Avaliação Inicial'}
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
            Nome Completo *
          </Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => onChange({ ...formData, name: e.target.value })}
            placeholder="Digite seu nome completo"
            className={`h-12 ${
              theme === 'dark'
                ? 'bg-[#0a0f0d] border-white/10 text-white'
                : 'bg-gray-50 border-gray-200 text-gray-900'
            }`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
            E-mail *
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => onChange({ ...formData, email: e.target.value })}
            placeholder="seu@email.com"
            className={`h-12 ${
              theme === 'dark'
                ? 'bg-[#0a0f0d] border-white/10 text-white'
                : 'bg-gray-50 border-gray-200 text-gray-900'
            }`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
            Telefone / WhatsApp *
          </Label>
          <Input
            id="phone"
            required
            value={formData.phone}
            onChange={(e) => onChange({ ...formData, phone: e.target.value })}
            placeholder="(00) 00000-0000"
            className={`h-12 ${
              theme === 'dark'
                ? 'bg-[#0a0f0d] border-white/10 text-white'
                : 'bg-gray-50 border-gray-200 text-gray-900'
            }`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
            Mensagem
          </Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => onChange({ ...formData, message: e.target.value })}
            placeholder="Conte um pouco sobre sua situação..."
            rows={4}
            className={`resize-none ${
              theme === 'dark'
                ? 'bg-[#0a0f0d] border-white/10 text-white'
                : 'bg-gray-50 border-gray-200 text-gray-900'
            }`}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0d9c6e] hover:bg-[#0a7d58] text-white py-6 text-lg font-bold shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              Confirmar Solicitação
              <CheckCircle2 size={20} className="ml-2" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}