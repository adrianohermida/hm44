import React, { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import EditorPlanoHeader from "./editor/EditorPlanoHeader";
import EditorPlanoClienteSection from "./editor/EditorPlanoClienteSection";
import EditorPlanoDadosSection from "./editor/EditorPlanoDadosSection";
import EditorPlanoDiagnostico from "./editor/EditorPlanoDiagnostico";

export default function EditorPlanoWrapper({ planoExistente, onSalvar, onCancelar }) {
  const [escritorioId, setEscritorioId] = useState(null);
  const [clienteIdSelecionado, setClienteIdSelecionado] = useState('');
  const [modoNovoCliente, setModoNovoCliente] = useState(false);
  const [planoData, setPlanoData] = useState({
    rendas: [],
    despesas: [],
    dividas: [],
    credores: []
  });

  useEffect(() => {
    loadEscritorio();
  }, []);

  const loadEscritorio = async () => {
    const result = await base44.entities.Escritorio.list();
    if (result[0]) setEscritorioId(result[0].id);
  };

  const { data: clienteSelecionado } = useQuery({
    queryKey: ['cliente-plano', clienteIdSelecionado],
    queryFn: async () => {
      const result = await base44.entities.Cliente.filter({ id: clienteIdSelecionado });
      return result[0];
    },
    enabled: !!clienteIdSelecionado
  });

  const handleSalvar = async () => {
    if (!clienteIdSelecionado) {
      toast.error('Selecione um cliente');
      return;
    }

    const totalRendas = planoData.rendas.reduce((s, r) => s + r.valor_mensal, 0);
    const totalDespesas = planoData.despesas.reduce((s, d) => s + d.valor_mensal, 0);
    const totalDividas = planoData.dividas.reduce((s, d) => s + d.saldo_devedor_atual, 0);

    const plano = {
      escritorio_id: escritorioId,
      cliente_id: clienteIdSelecionado,
      cliente_nome: clienteSelecionado?.nome_completo,
      renda_mensal_total: totalRendas,
      minimo_existencial: totalDespesas,
      total_dividas: totalDividas,
      status_plano: 'proposta'
    };

    await base44.entities.PlanoPagamento.create(plano);
    toast.success('Plano criado');
    onSalvar();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <EditorPlanoHeader onSalvar={handleSalvar} onCancelar={onCancelar} />

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <EditorPlanoClienteSection
            clienteId={clienteIdSelecionado}
            onClienteChange={setClienteIdSelecionado}
            modoNovo={modoNovoCliente}
            onToggleModo={setModoNovoCliente}
            escritorioId={escritorioId}
            clienteSelecionado={clienteSelecionado}
          />

          <EditorPlanoDadosSection 
            planoData={planoData} 
            onChange={setPlanoData} 
          />

          <EditorPlanoDiagnostico 
            planoData={planoData} 
            clienteSelecionado={clienteSelecionado}
          />
        </div>
      </div>
    </div>
  );
}