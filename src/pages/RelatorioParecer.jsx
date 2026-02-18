import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import RelatorioForm from "../components/relatorios/RelatorioForm";
import Breadcrumb from "@/components/seo/Breadcrumb";

export default function RelatorioParecer() {
  const [relatorios, setRelatorios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gerando, setGerando] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await base44.auth.me();
    setUser(userData);
    loadData(userData);
  };

  const loadData = async (userData) => {
    setLoading(true);
    const [relatoriosData, clientesData, planosData] = await Promise.all([
      base44.entities.RelatorioParecer.filter({ escritorio_id: userData.escritorio_id }),
      base44.entities.Cliente.filter({ escritorio_id: userData.escritorio_id }),
      base44.entities.PlanoPagamento.filter({ escritorio_id: userData.escritorio_id })
    ]);
    setRelatorios(relatoriosData);
    setClientes(clientesData);
    setPlanos(planosData);
    setLoading(false);
  };

  const handleSave = async (data) => {
    await base44.entities.RelatorioParecer.create({ ...data, escritorio_id: user.escritorio_id });
    setShowForm(false);
    loadData(user);
  };

  const gerarPDF = async (relatorio) => {
    setGerando(relatorio.id);
    alert("Funcionalidade de geração de PDF será implementada em breve.");
    await base44.entities.RelatorioParecer.update(relatorio.id, { status: 'finalizado' });
    loadData(user);
    setGerando(null);
  };

  const tipoLabels = { diagnostico: "Diagnóstico", plano_pagamento: "Plano de Pagamento", parecer_tecnico: "Parecer Técnico", acompanhamento: "Acompanhamento" };
  const statusMap = { rascunho: { label: "Rascunho", class: "bg-gray-100 text-gray-700" }, finalizado: { label: "Finalizado", class: "bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)]" }, enviado: { label: "Enviado", class: "bg-blue-100 text-blue-700" } };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumb items={[{ label: 'Relatórios' }]} />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Relatórios e Pareceres</h1>
            <p className="text-[var(--text-secondary)]">Gere relatórios técnicos e pareceres</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />Novo Relatório
          </Button>
        </div>

        {showForm && <RelatorioForm clientes={clientes} planos={planos} onSave={handleSave} onCancel={() => setShowForm(false)} />}

        <Card className="shadow-lg border-0 bg-[var(--bg-primary)]">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-[var(--bg-secondary)]">
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)] mx-auto"></div></TableCell></TableRow>
                ) : relatorios.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-[var(--text-secondary)]">Nenhum relatório</TableCell></TableRow>
                ) : (
                  relatorios.map((r) => {
                    const cliente = clientes.find(c => c.id === r.cliente_id);
                    return (
                      <TableRow key={r.id} className="hover:bg-[var(--bg-secondary)]">
                        <TableCell className="font-medium">{cliente?.nome_completo || "N/A"}</TableCell>
                        <TableCell><Badge variant="outline">{tipoLabels[r.tipo_relatorio]}</Badge></TableCell>
                        <TableCell>{r.data_emissao ? format(new Date(r.data_emissao), 'dd/MM/yyyy') : '-'}</TableCell>
                        <TableCell><Badge variant="outline" className={statusMap[r.status]?.class}>{statusMap[r.status]?.label}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => gerarPDF(r)} disabled={gerando === r.id}>
                            {gerando === r.id ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--brand-primary)]" /> : <Download className="w-4 h-4" />}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}