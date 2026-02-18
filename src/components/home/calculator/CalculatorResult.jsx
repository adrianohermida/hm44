import React from 'react';
import { AlertCircle, CheckCircle, MessageCircle, Calculator, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

export default function CalculatorResult({ resultado, onReset }) {
  const { comprometimento, superendividado, dividas, parcelas, renda } = resultado;

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-xl ${superendividado ? 'bg-[var(--brand-error)]/10 border-2 border-[var(--brand-error)]/30' : 'bg-[var(--brand-warning)]/10 border-2 border-[var(--brand-warning)]/30'}`}>
        {superendividado ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-[var(--brand-error)]" />
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">Identificamos Superendividamento</h3>
            </div>
            <p className="text-[var(--text-primary)] mb-4">
              Suas dívidas comprometem <span className="font-bold text-3xl text-[var(--brand-error)]">{comprometimento.toFixed(1)}%</span> da sua renda (limite saudável: 30%)
            </p>
            <div className="bg-[var(--bg-primary)] p-4 rounded-lg mb-4 space-y-1">
              <p className="text-sm text-[var(--text-primary)]"><strong>Total de Dívidas:</strong> R$ {dividas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
              <p className="text-sm text-[var(--text-primary)]"><strong>Parcelas Mensais:</strong> R$ {parcelas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
              <p className="text-sm text-[var(--text-primary)]"><strong>Renda Líquida:</strong> R$ {renda.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
            </div>
            <p className="text-[var(--text-primary)] font-bold">✅ Ótima notícia: Você tem direito à Lei do Superendividamento! Podemos reduzir até 70% das suas dívidas e restaurar sua paz financeira.</p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-8 h-8 text-[var(--brand-warning)]" />
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">Atenção Preventiva</h3>
            </div>
            <p className="text-[var(--text-primary)] mb-4">
              Comprometimento atual: <span className="font-bold text-2xl text-[var(--brand-warning)]">{comprometimento.toFixed(1)}%</span>
            </p>
            <p className="text-[var(--text-primary)] font-semibold">
              Mesmo abaixo de 30%, você pode estar pagando juros abusivos ou condições desfavoráveis. Faça uma análise completa com nossos especialistas!
            </p>
          </>
        )}
      </div>

      <div className="flex gap-3 flex-col sm:flex-row">
        <Button 
          onClick={() => window.open('https://wa.me/5551996032004?text=Olá, usei a calculadora e gostaria de falar com um advogado', '_blank')} 
          className="flex-1 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] text-white py-4 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-base font-semibold"
        >
          <MessageCircle className="w-5 h-5" />
          Falar com Advogado
        </Button>
        <Button 
          onClick={onReset} 
          variant="outline" 
          className="flex-1 border-2 border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] py-4"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Nova Análise
        </Button>
        <Button 
          onClick={() => window.location.href = createPageUrl('EditorPlano')} 
          className="flex-1 bg-[var(--brand-success)] hover:bg-green-700 text-white py-4 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-base font-semibold"
        >
          <Calculator className="w-5 h-5" />
          Monte seu Plano
        </Button>
      </div>
    </div>
  );
}