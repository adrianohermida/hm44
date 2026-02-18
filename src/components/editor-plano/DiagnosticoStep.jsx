import React from "react";
import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function DiagnosticoStep({ cliente, rendas, despesas, dividas }) {
  const totalRendas = rendas.reduce((sum, r) => sum + (r.valor_mensal || 0), 0);
  const totalDespesas = despesas.reduce((sum, d) => sum + (d.valor_mensal || 0), 0);
  const totalDividas = dividas.reduce((sum, d) => sum + (d.saldo_devedor_atual || 0), 0);
  const parcelasMensais = dividas.reduce((sum, d) => sum + (d.valor_parcela_atual || 0), 0);

  const valorDisponivel = totalRendas - totalDespesas;
  const comprometimento = totalRendas > 0 ? (parcelasMensais / totalRendas) * 100 : 0;
  const classificacao = comprometimento > 50 ? "superendividado" : comprometimento > 30 ? "atencao" : "saudavel";

  const classificacaoConfig = {
    superendividado: {
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      label: "Superendividado",
      mensagem: "Situação crítica! Suas dívidas comprometem mais de 50% da renda."
    },
    atencao: {
      icon: TrendingDown,
      color: "text-[var(--brand-warning)]",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      label: "Atenção",
      mensagem: "Comprometimento elevado. Recomenda-se renegociação."
    },
    saudavel: {
      icon: CheckCircle,
      color: "text-[var(--brand-success)]",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      label: "Saudável",
      mensagem: "Situação controlada, mas sempre revise suas condições."
    }
  };

  const config = classificacaoConfig[classificacao];
  const Icon = config.icon;

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-xl ${config.bgColor} border-2 ${config.borderColor}`}>
        <div className="flex items-center gap-3 mb-4">
          <Icon className={`w-8 h-8 ${config.color}`} />
          <h3 className="text-2xl font-bold text-[var(--text-primary)]">{config.label}</h3>
        </div>
        <p className="text-[var(--text-primary)] mb-4">{config.mensagem}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Comprometimento da Renda</span>
            <span className="font-bold">{comprometimento.toFixed(1)}%</span>
          </div>
          <Progress value={comprometimento} className="h-3" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[var(--bg-primary)] p-4 rounded-lg shadow border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[var(--brand-success)]" />
            <h4 className="font-semibold text-[var(--text-primary)]">Rendas</h4>
          </div>
          <p className="text-2xl font-bold text-[var(--brand-success)]">R$ {totalRendas.toFixed(2)}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">{rendas.length} fonte(s)</p>
        </div>

        <div className="bg-[var(--bg-primary)] p-4 rounded-lg shadow border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-[var(--brand-warning)]" />
            <h4 className="font-semibold text-[var(--text-primary)]">Despesas Essenciais</h4>
          </div>
          <p className="text-2xl font-bold text-[var(--brand-warning)]">R$ {totalDespesas.toFixed(2)}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">{despesas.length} despesa(s)</p>
        </div>

        <div className="bg-[var(--bg-primary)] p-4 rounded-lg shadow border">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h4 className="font-semibold text-[var(--text-primary)]">Total de Dívidas</h4>
          </div>
          <p className="text-2xl font-bold text-red-600">R$ {totalDividas.toFixed(2)}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">{dividas.length} dívida(s)</p>
        </div>

        <div className="bg-[var(--bg-primary)] p-4 rounded-lg shadow border">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-[var(--brand-primary)]" />
            <h4 className="font-semibold text-[var(--text-primary)]">Valor Disponível</h4>
          </div>
          <p className={`text-2xl font-bold ${valorDisponivel > 0 ? 'text-[var(--brand-success)]' : 'text-red-600'}`}>
            R$ {valorDisponivel.toFixed(2)}
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Renda - Despesas</p>
        </div>
      </div>
    </div>
  );
}