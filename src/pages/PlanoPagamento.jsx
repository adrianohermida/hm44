import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { AlertCircle, Calculator, Save } from "lucide-react";
import ClienteSelector from "../components/shared/ClienteSelector";
import Breadcrumb from "@/components/seo/Breadcrumb";

export default function PlanoPagamento() {
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [parametros, setParametros] = useState({ percentualMinimo: 100, desagio: 0, prazoMeses: 24 });
  const [plano, setPlano] = useState(null);
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await base44.auth.me();
    setUser(userData);
    const clientesData = await base44.entities.Cliente.filter({ escritorio_id: userData.escritorio_id, status: 'ativo' });
    setClientes(clientesData);
  };

  useEffect(() => {
    if (selectedCliente && user) calcularPlano();
    else setPlano(null);
  }, [selectedCliente, parametros]);

  const calcularPlano = async () => {
    setLoading(true);
    const [rendas, despesas, dividas, credores] = await Promise.all([
      base44.entities.FonteDeRenda.filter({ cliente_id: selectedCliente.id, ativa: true }),
      base44.entities.DespesaMinimoExistencial.filter({ cliente_id: selectedCliente.id }),
      base44.entities.Divida.filter({ cliente_id: selectedCliente.id }),
      base44.entities.Credor.filter({ escritorio_id: user.escritorio_id })
    ]);

    const rendaMensalTotal = rendas.reduce((s, r) => s + (r.valor_mensal || 0), 0);
    const despesasTotal = despesas.reduce((s, d) => s + (d.valor_mensal || 0), 0);
    const minimoExistencial = (despesasTotal * parametros.percentualMinimo) / 100;
    const valorDisponivel = rendaMensalTotal - minimoExistencial;
    const totalDividas = dividas.reduce((s, d) => s + (d.saldo_devedor_atual || 0), 0);
    const parcelasAtuais = dividas.reduce((s, d) => s + (d.valor_parcela_atual || 0), 0);
    const totalComDesagio = totalDividas * (1 - parametros.desagio / 100);
    const parcelaProposta = totalComDesagio / parametros.prazoMeses;
    const percentualComprometimento = valorDisponivel > 0 ? (parcelasAtuais / valorDisponivel) * 100 : 100;

    let classificacao = "saudavel";
    if (percentualComprometimento > 50) classificacao = "superendividado";
    else if (percentualComprometimento > 30) classificacao = "atencao";

    const detalhesPorCredor = dividas.map(d => {
      const credor = credores.find(c => c.id === d.credor_id);
      const valorNegociado = (d.saldo_devedor_atual || 0) * (1 - parametros.desagio / 100);
      const parcelaCredor = valorNegociado / parametros.prazoMeses;
      return { divida_id: d.id, credor_nome: credor?.nome_credor || "N/A", valor_original: d.saldo_devedor_atual || 0, valor_negociado: valorNegociado, parcelas: parametros.prazoMeses, valor_parcela: parcelaCredor };
    });

    setPlano({ rendaMensalTotal, minimoExistencial, percentualMinimoUsado: parametros.percentualMinimo, valorDisponivel, totalDividas, totalComDesagio, parcelaProposta, percentualComprometimento, classificacao, desagioAplicado: parametros.desagio, prazoMeses: parametros.prazoMeses, detalhesPorCredor, economia: totalDividas - totalComDesagio });
    setLoading(false);
  };

  const salvarPlano = async () => {
    setSalvando(true);
    await base44.entities.PlanoPagamento.create({
      cliente_id: selectedCliente.id, renda_mensal_total: plano.rendaMensalTotal, minimo_existencial: plano.minimoExistencial,
      percentual_minimo_usado: plano.percentualMinimoUsado, valor_disponivel_pagamento: plano.valorDisponivel, total_dividas: plano.totalDividas,
      percentual_comprometimento: plano.percentualComprometimento, classificacao_endividamento: plano.classificacao, desagio_aplicado: plano.desagioAplicado,
      prazo_meses: plano.prazoMeses, valor_parcela_proposta: plano.parcelaProposta, detalhes_plano: plano.detalhesPorCredor,
      status_plano: "proposta", data_geracao: new Date().toISOString().split('T')[0], escritorio_id: user.escritorio_id
    });
    alert("Plano salvo com sucesso!");
    setSalvando(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumb items={[{ label: 'Plano de Pagamento' }]} />
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Plano de Pagamento</h1>
          <p className="text-[var(--text-secondary)]">Configure planos personalizados</p>
        </div>

        <ClienteSelector clientes={clientes} selectedCliente={selectedCliente} onSelectCliente={setSelectedCliente} />

        {!selectedCliente && <Alert><AlertCircle className="h-4 w-4" /><AlertDescription>Selecione um cliente.</AlertDescription></Alert>}

        {selectedCliente && (
          <>
            <Card className="shadow-lg border-0 bg-[var(--bg-primary)]">
              <CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="w-5 h-5 text-[var(--brand-primary)]" />Parâmetros do Plano</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Percentual do Mínimo Existencial</Label>
                    <Badge variant="outline">{parametros.percentualMinimo}%</Badge>
                  </div>
                  <Slider value={[parametros.percentualMinimo]} onValueChange={(v) => setParametros(p => ({ ...p, percentualMinimo: v[0] }))} min={70} max={100} step={5} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Deságio Proposto (%)</Label>
                    <Badge variant="outline">{parametros.desagio}%</Badge>
                  </div>
                  <Slider value={[parametros.desagio]} onValueChange={(v) => setParametros(p => ({ ...p, desagio: v[0] }))} min={0} max={50} step={5} />
                </div>
                <div>
                  <Label>Prazo (meses)</Label>
                  <Input type="number" min="6" max="60" value={parametros.prazoMeses} onChange={(e) => setParametros(p => ({ ...p, prazoMeses: parseInt(e.target.value) || 24 }))} className="mt-2" />
                </div>
              </CardContent>
            </Card>

            {plano && !loading && (
              <>
                <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-teal-50">
                  <CardHeader><CardTitle className="text-2xl">Resumo do Plano</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-4 bg-white rounded-xl shadow">
                        <p className="text-sm text-[var(--text-secondary)] mb-1">Valor Negociado</p>
                        <p className="text-3xl font-bold text-[var(--brand-info)]">R$ {plano.totalComDesagio.toFixed(2)}</p>
                        {plano.economia > 0 && <p className="text-sm text-[var(--brand-success)] mt-1">Economia: R$ {plano.economia.toFixed(2)}</p>}
                      </div>
                      <div className="p-4 bg-white rounded-xl shadow">
                        <p className="text-sm text-[var(--text-secondary)] mb-1">Parcela Mensal</p>
                        <p className="text-3xl font-bold text-[var(--brand-primary)]">R$ {plano.parcelaProposta.toFixed(2)}</p>
                        <p className="text-sm text-[var(--text-tertiary)] mt-1">em {plano.prazoMeses}x</p>
                      </div>
                      <div className="p-4 bg-white rounded-xl shadow">
                        <p className="text-sm text-[var(--text-secondary)] mb-1">Valor Disponível</p>
                        <p className="text-3xl font-bold text-[var(--brand-success)]">R$ {plano.valorDisponivel.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="p-4 border-2 border-[var(--brand-info)] rounded-xl bg-blue-50">
                      <h4 className="font-semibold text-[var(--text-primary)] mb-2">Viabilidade</h4>
                      {plano.parcelaProposta <= plano.valorDisponivel ? (
                        <p className="text-[var(--brand-success)]">✓ Plano viável!</p>
                      ) : (
                        <p className="text-[var(--brand-error)]">✗ Parcela excede capacidade. Ajuste parâmetros.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-end">
                  <Button onClick={salvarPlano} disabled={salvando || plano.parcelaProposta > plano.valorDisponivel} className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-700)]">
                    {salvando ? "Salvando..." : <><Save className="w-4 h-4 mr-2" />Salvar Plano</>}
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}