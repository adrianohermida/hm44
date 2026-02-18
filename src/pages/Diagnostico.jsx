import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, AlertCircle, DollarSign, TrendingDown, FileText, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ClienteSelector from "../components/shared/ClienteSelector";
import DiagnosticoCard from "../components/diagnostico/DiagnosticoCard";
import Breadcrumb from "@/components/seo/Breadcrumb";

export default function Diagnostico() {
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [diagnostico, setDiagnostico] = useState(null);
  const [loading, setLoading] = useState(false);
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
    if (selectedCliente && user) calcularDiagnostico();
    else setDiagnostico(null);
  }, [selectedCliente]);

  const calcularDiagnostico = async () => {
    setLoading(true);
    const [rendas, despesas, dividas, credores] = await Promise.all([
      base44.entities.FonteDeRenda.filter({ cliente_id: selectedCliente.id, ativa: true }),
      base44.entities.DespesaMinimoExistencial.filter({ cliente_id: selectedCliente.id }),
      base44.entities.Divida.filter({ cliente_id: selectedCliente.id }),
      base44.entities.Credor.filter({ escritorio_id: user.escritorio_id })
    ]);

    const rendaMensalTotal = rendas.reduce((s, r) => s + (r.valor_mensal || 0), 0);
    const minimoExistencial = despesas.reduce((s, d) => s + (d.valor_mensal || 0), 0);
    const parcelasAtuais = dividas.reduce((s, d) => s + (d.valor_parcela_atual || 0), 0);
    const saldoDevedorTotal = dividas.reduce((s, d) => s + (d.saldo_devedor_atual || 0), 0);
    const valorDisponivel = rendaMensalTotal - minimoExistencial;
    const percentualComprometimento = valorDisponivel > 0 ? (parcelasAtuais / valorDisponivel) * 100 : (parcelasAtuais > 0 ? 100 : 0);

    let classificacao = "saudavel", classificacaoTexto = "Situação Saudável", classificacaoDescricao = "Endividamento aceitável.", classificacaoCor = "green";
    if (percentualComprometimento > 50) {
      classificacao = "superendividado";
      classificacaoTexto = "Superendividado";
      classificacaoDescricao = "Comprometimento >50%. Ação imediata necessária.";
      classificacaoCor = "red";
    } else if (percentualComprometimento > 30) {
      classificacao = "atencao";
      classificacaoTexto = "Atenção";
      classificacaoDescricao = "Comprometimento entre 30-50%. Monitorar.";
      classificacaoCor = "orange";
    }

    const detalhesPorCredor = dividas.map(d => {
      const credor = credores.find(c => c.id === d.credor_id);
      return { credor: credor?.nome_credor || "N/A", tipo: d.tipo_divida, parcela: d.valor_parcela_atual, saldo: d.saldo_devedor_atual, status: d.status_divida };
    });

    setDiagnostico({ rendaMensalTotal, minimoExistencial, valorDisponivel, parcelasAtuais, saldoDevedorTotal, percentualComprometimento, classificacao, classificacaoTexto, classificacaoDescricao, classificacaoCor, detalhesPorCredor, totalDividas: dividas.length });
    setLoading(false);
  };

  const icons = { saudavel: <CheckCircle className="w-12 h-12 text-[var(--brand-success)]" />, atencao: <AlertCircle className="w-12 h-12 text-[var(--brand-warning)]" />, superendividado: <AlertTriangle className="w-12 h-12 text-[var(--brand-error)]" /> };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumb items={[{ label: 'Diagnóstico' }]} />
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Diagnóstico de Endividamento</h1>
          <p className="text-[var(--text-secondary)]">Análise completa da situação financeira</p>
        </div>

        <ClienteSelector clientes={clientes} selectedCliente={selectedCliente} onSelectCliente={setSelectedCliente} />

        {!selectedCliente && <Alert><AlertCircle className="h-4 w-4" /><AlertDescription>Selecione um cliente para visualizar o diagnóstico.</AlertDescription></Alert>}
        {loading && <Card><CardContent className="p-12 text-center"><div className="flex flex-col items-center gap-4"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)]" /><p className="text-[var(--text-secondary)]">Calculando...</p></div></CardContent></Card>}

        {diagnostico && !loading && (
          <>
            <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-teal-50">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="p-6 bg-blue-100 rounded-2xl">{icons[diagnostico.classificacao]}</div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">{diagnostico.classificacaoTexto}</h2>
                    <p className="text-lg text-[var(--text-secondary)] mb-4">{diagnostico.classificacaoDescricao}</p>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <Badge className="bg-[var(--brand-primary)] text-white text-lg px-4 py-2">{diagnostico.percentualComprometimento.toFixed(1)}% comprometido</Badge>
                      <Badge variant="outline" className="text-lg px-4 py-2">{diagnostico.totalDividas} dívida(s)</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DiagnosticoCard title="Renda Mensal" value={`R$ ${diagnostico.rendaMensalTotal.toFixed(2)}`} icon={DollarSign} color="green" />
              <DiagnosticoCard title="Mínimo Existencial" value={`R$ ${diagnostico.minimoExistencial.toFixed(2)}`} icon={TrendingDown} color="orange" />
              <DiagnosticoCard title="Valor Disponível" value={`R$ ${diagnostico.valorDisponivel.toFixed(2)}`} icon={Calculator} color="blue" />
              <DiagnosticoCard title="Parcelas Mensais" value={`R$ ${diagnostico.parcelasAtuais.toFixed(2)}`} icon={FileText} color="red" />
            </div>

            <Card className="shadow-lg border-0 bg-[var(--bg-primary)]">
              <CardHeader><CardTitle>Comprometimento de Renda</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--text-primary)]">Percentual para pagamento de dívidas</span>
                    <span className="text-sm font-bold text-[var(--text-primary)]">{diagnostico.percentualComprometimento.toFixed(1)}%</span>
                  </div>
                  <Progress value={Math.min(diagnostico.percentualComprometimento, 100)} className="h-4" />
                  <div className="flex justify-between mt-2 text-xs text-[var(--text-tertiary)]">
                    <span>0% - Saudável</span>
                    <span>30% - Atenção</span>
                    <span>50% - Superendividado</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <p className="text-sm text-[var(--text-secondary)] mb-1">Saldo Devedor Total</p>
                    <p className="text-2xl font-bold text-[var(--brand-error)]">R$ {diagnostico.saldoDevedorTotal.toFixed(2)}</p>
                  </div>
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <p className="text-sm text-[var(--text-secondary)] mb-1">Comprometimento em R$</p>
                    <p className="text-2xl font-bold text-[var(--brand-warning)]">R$ {diagnostico.parcelasAtuais.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {diagnostico.classificacao !== 'saudavel' && (
              <Card className="border-l-4 border-l-[var(--brand-info)] bg-blue-50 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-[var(--text-primary)] text-lg mb-2">Próximo Passo: Plano de Pagamento</h3>
                      <p className="text-[var(--text-secondary)]">Crie um plano personalizado para renegociar as dívidas.</p>
                    </div>
                    <Link to={createPageUrl("PlanoPagamento")}>
                      <Button className="bg-[var(--brand-info)] hover:bg-blue-700">
                        <FileText className="w-4 h-4 mr-2" />Gerar Plano
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}