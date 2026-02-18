import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, X, Save } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Breadcrumb from "@/components/seo/Breadcrumb";

export default function FontesRenda() {
  const [rendas, setRendas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRenda, setEditingRenda] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const emptyForm = { cliente_id: "", tipo_renda: "salario", descricao: "", valor_mensal: 0, ativa: true, data_inicio: "" };
  const [formData, setFormData] = useState(emptyForm);

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
    const [rendasData, clientesData] = await Promise.all([
      base44.entities.FonteDeRenda.filter({ escritorio_id: userData.escritorio_id }),
      base44.entities.Cliente.filter({ escritorio_id: userData.escritorio_id, status: 'ativo' })
    ]);
    setRendas(rendasData);
    setClientes(clientesData);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingRenda) {
      await base44.entities.FonteDeRenda.update(editingRenda.id, formData);
    } else {
      await base44.entities.FonteDeRenda.create({ ...formData, escritorio_id: user.escritorio_id });
    }
    setShowForm(false);
    setEditingRenda(null);
    setFormData(emptyForm);
    loadData(user);
  };

  const handleDelete = async (id) => {
    if (confirm("Deseja realmente excluir esta fonte de renda?")) {
      await base44.entities.FonteDeRenda.delete(id);
      loadData(user);
    }
  };

  const getClienteNome = (id) => clientes.find(c => c.id === id)?.nome_completo || "N/A";

  const tipoLabels = { salario: "Salário", aposentadoria: "Aposentadoria", pensao: "Pensão", autonomo: "Autônomo", aluguel: "Aluguel", investimentos: "Investimentos", outros: "Outros" };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumb items={[{ label: 'Fontes de Renda' }]} />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Fontes de Renda</h1>
            <p className="text-[var(--text-secondary)]">Gerencie as fontes de renda dos clientes</p>
          </div>
          <Button onClick={() => { setShowForm(true); setEditingRenda(null); setFormData(emptyForm); }} className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-700)]">
            <Plus className="w-4 h-4 mr-2" />Nova Fonte
          </Button>
        </div>

        {showForm && (
          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-[var(--brand-primary)] text-white">
              <div className="flex justify-between items-center">
                <CardTitle>{editingRenda ? "Editar Fonte" : "Nova Fonte"}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => { setShowForm(false); setEditingRenda(null); setFormData(emptyForm); }} className="text-white hover:bg-white/20">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label>Cliente *</Label>
                    <Select value={formData.cliente_id} onValueChange={(v) => setFormData(p => ({ ...p, cliente_id: v }))} required>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{clientes.map(c => <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tipo *</Label>
                    <Select value={formData.tipo_renda} onValueChange={(v) => setFormData(p => ({ ...p, tipo_renda: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salario">Salário</SelectItem>
                        <SelectItem value="aposentadoria">Aposentadoria</SelectItem>
                        <SelectItem value="pensao">Pensão</SelectItem>
                        <SelectItem value="autonomo">Autônomo</SelectItem>
                        <SelectItem value="aluguel">Aluguel</SelectItem>
                        <SelectItem value="investimentos">Investimentos</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Valor Mensal (R$) *</Label>
                    <Input type="number" step="0.01" value={formData.valor_mensal} onChange={(e) => setFormData(p => ({ ...p, valor_mensal: parseFloat(e.target.value) || 0 }))} required />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Descrição</Label>
                    <Input value={formData.descricao} onChange={(e) => setFormData(p => ({ ...p, descricao: e.target.value }))} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-[var(--bg-secondary)] flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingRenda(null); setFormData(emptyForm); }}>Cancelar</Button>
                <Button type="submit" className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-700)]">
                  <Save className="w-4 h-4 mr-2" />{editingRenda ? "Atualizar" : "Cadastrar"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        <Card className="shadow-lg border-0 bg-[var(--bg-primary)]">
          <CardHeader><CardTitle>Fontes de Renda</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-[var(--bg-secondary)]">
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor Mensal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)] mx-auto"></div></TableCell></TableRow>
                ) : rendas.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-[var(--text-secondary)]">Nenhuma fonte cadastrada</TableCell></TableRow>
                ) : (
                  rendas.map((r) => (
                    <TableRow key={r.id} className="hover:bg-[var(--bg-secondary)]">
                      <TableCell className="font-medium">{getClienteNome(r.cliente_id)}</TableCell>
                      <TableCell><Badge variant="outline">{tipoLabels[r.tipo_renda]}</Badge></TableCell>
                      <TableCell className="font-semibold text-[var(--brand-success)]">R$ {r.valor_mensal?.toFixed(2)}</TableCell>
                      <TableCell><Badge variant="outline" className={r.ativa ? "bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)]" : "bg-gray-100 text-gray-700"}>{r.ativa ? "Ativa" : "Inativa"}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => { setEditingRenda(r); setFormData(r); setShowForm(true); }}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)} className="hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}