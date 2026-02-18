import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Plus, Edit, CheckCircle2, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from "sonner";

export default function GestaoTermosLegais() {
  const queryClient = useQueryClient();
  const [showPanel, setShowPanel] = useState(false);
  const [editingTermo, setEditingTermo] = useState(null);
  const [formData, setFormData] = useState({
    tipo: "termos_uso",
    titulo: "",
    conteudo_html: "",
    versao: "1.0",
    modulo_aplicacao: "global",
    obrigatorio: true,
    ativo: true,
    data_vigencia: new Date().toISOString().split('T')[0]
  });

  const { data: user } = useQuery({
    queryKey: ["auth-user"],
    queryFn: () => base44.auth.me()
  });

  const { data: termos = [] } = useQuery({
    queryKey: ["termos-legais"],
    queryFn: () => base44.entities.TermoLegal.list("-created_date"),
    enabled: user?.role === 'admin'
  });

  const { data: aceites = [] } = useQuery({
    queryKey: ["aceites-termos"],
    queryFn: () => base44.entities.AceiteTermoLegal.list("-created_date"),
    enabled: user?.role === 'admin'
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await base44.functions.invoke('criarTermoLegal', {
        ...data,
        autor_criacao: user.full_name || user.email
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["termos-legais"]);
      toast.success("Termo criado");
      setShowPanel(false);
      setEditingTermo(null);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await base44.functions.invoke('atualizarTermoLegal', {
        termo_id: id,
        ...data
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["termos-legais"]);
      toast.success("Termo atualizado");
      setShowPanel(false);
      setEditingTermo(null);
    }
  });

  const handleSubmit = () => {
    if (!formData.titulo || !formData.conteudo_html) {
      toast.error("Preencha título e conteúdo");
      return;
    }
    if (editingTermo) {
      updateMutation.mutate({ id: editingTermo.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (user?.role !== 'admin') return <div className="p-8 text-center text-red-600">Acesso restrito</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Termos Legais</h1>
          <p className="text-gray-600">Editor com rastreabilidade MP 2.200/2</p>
        </div>
        <Button onClick={() => { setEditingTermo(null); setShowPanel(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Termo
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-6">
          <FileText className="w-10 h-10 mb-2 text-purple-600" />
          <div className="text-3xl font-bold">{termos.filter(t => t.ativo).length}</div>
          <div className="text-sm text-gray-600">Termos Ativos</div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <CheckCircle2 className="w-10 h-10 mb-2 text-green-600" />
          <div className="text-3xl font-bold">{aceites.filter(a => a.aceito).length}</div>
          <div className="text-sm text-gray-600">Aceites Totais</div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <Hash className="w-10 h-10 mb-2 text-blue-600" />
          <div className="text-3xl font-bold">{termos.filter(t => t.hash_sha256).length}</div>
          <div className="text-sm text-gray-600">Com Hash SHA-256</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className="text-left p-4 font-semibold">Título</th>
              <th className="text-left p-4 font-semibold">Tipo</th>
              <th className="text-left p-4 font-semibold">Versão</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-right p-4 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {termos.map(termo => (
              <tr key={termo.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-bold">{termo.titulo}</td>
                <td className="p-4 text-sm">{termo.tipo}</td>
                <td className="p-4 text-sm">{termo.versao}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    termo.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {termo.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Button size="sm" variant="ghost" onClick={() => { setEditingTermo(termo); setFormData(termo); setShowPanel(true); }}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={showPanel} onOpenChange={setShowPanel}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTermo ? 'Editar' : 'Novo'} Termo Legal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={formData.tipo} onValueChange={(v) => setFormData({ ...formData, tipo: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="termos_uso">Termos de Uso</SelectItem>
                <SelectItem value="politica_privacidade">Política de Privacidade</SelectItem>
                <SelectItem value="lgpd">LGPD</SelectItem>
                <SelectItem value="cookies">Cookies</SelectItem>
                <SelectItem value="cfm_normas">Normas CFM</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Título"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            />
            <Input
              placeholder="Versão (ex: 1.0)"
              value={formData.versao}
              onChange={(e) => setFormData({ ...formData, versao: e.target.value })}
            />
            <ReactQuill
              value={formData.conteudo_html}
              onChange={(v) => setFormData({ ...formData, conteudo_html: v })}
              className="h-64 mb-12"
            />
            <div className="flex gap-2 justify-end pt-8">
              <Button variant="outline" onClick={() => setShowPanel(false)}>Cancelar</Button>
              <Button onClick={handleSubmit}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}