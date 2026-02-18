import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BookOpen, Plus, Search, TrendingUp, X, Edit, Trash2, Calendar, Brain } from 'lucide-react';
import { toast } from 'sonner';
import RegrasPrazoForm from './RegrasPrazoForm';
import FeriadosLibrary from './FeriadosLibrary';

export default function BibliotecaPrazos({ onClose }) {
  const [activeTab, setActiveTab] = useState('regras');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRegra, setEditingRegra] = useState(null);
  const queryClient = useQueryClient();

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const escritorios = await base44.entities.Escritorio.list();
      return escritorios[0];
    }
  });

  const { data: regras = [], isLoading } = useQuery({
    queryKey: ['regras-prazo'],
    queryFn: () => base44.entities.RegraPrazo.filter({
      escritorio_id: escritorio.id
    }, '-vezes_aplicada'),
    enabled: !!escritorio?.id,
    initialData: []
  });

  const { data: prazos = [] } = useQuery({
    queryKey: ['prazos'],
    queryFn: () => base44.entities.Prazo.filter({
      escritorio_id: escritorio.id
    }),
    enabled: !!escritorio?.id,
    initialData: []
  });

  const deleteRegraMutation = useMutation({
    mutationFn: (id) => base44.entities.RegraPrazo.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['regras-prazo']);
      toast.success('Regra excluída');
    }
  });

  const filteredRegras = regras.filter(r =>
    r.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.tipo_prazo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.tribunal?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const regrasMaisUsadas = [...regras]
    .sort((a, b) => (b.vezes_aplicada || 0) - (a.vezes_aplicada || 0))
    .slice(0, 5);

  const regrasMaisEficientes = [...regras]
    .filter(r => r.vezes_aplicada > 0)
    .sort((a, b) => (b.taxa_sucesso || 0) - (a.taxa_sucesso || 0))
    .slice(0, 5);

  const gerarSugestoesIA = () => {
    const tiposComuns = prazos
      .map(p => p.tipo_prazo)
      .filter(Boolean)
      .reduce((acc, tipo) => {
        acc[tipo] = (acc[tipo] || 0) + 1;
        return acc;
      }, {});

    return Object.keys(tiposComuns).filter(
      tipo => !regras.some(r => r.tipo_prazo === tipo)
    );
  };

  const sugestoesIA = gerarSugestoesIA();

  if (!escritorio) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-6xl bg-white my-8">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                Biblioteca de Prazos Processuais
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Gerencie regras de contagem, feriados e aprendizado inteligente
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full mb-6">
              <TabsTrigger value="regras">
                <BookOpen className="w-4 h-4 mr-2" />
                Regras de Prazo
              </TabsTrigger>
              <TabsTrigger value="feriados">
                <Calendar className="w-4 h-4 mr-2" />
                Feriados
              </TabsTrigger>
              <TabsTrigger value="ia">
                <Brain className="w-4 h-4 mr-2" />
                Inteligência
              </TabsTrigger>
            </TabsList>

            <TabsContent value="regras" className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder="Buscar regras..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Regra
                </Button>
              </div>

              {isLoading ? (
                <div className="text-center py-12 text-slate-500">Carregando...</div>
              ) : filteredRegras.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500">Nenhuma regra cadastrada</p>
                  <Button onClick={() => setShowForm(true)} className="mt-4">
                    Criar primeira regra
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {filteredRegras.map(regra => (
                    <Card key={regra.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-slate-900">{regra.nome}</h3>
                              <Badge>{regra.tipo_prazo}</Badge>
                              <Badge variant="outline">{regra.dias_prazo} dias</Badge>
                              {!regra.ativa && <Badge variant="secondary">Inativa</Badge>}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-slate-600">
                              <div><span className="font-medium">Contagem:</span> {regra.tipo_contagem}</div>
                              {regra.tribunal && <div><span className="font-medium">Tribunal:</span> {regra.tribunal}</div>}
                              {regra.area_direito && <div><span className="font-medium">Área:</span> {regra.area_direito}</div>}
                              <div><span className="font-medium">Usado:</span> {regra.vezes_aplicada || 0}x</div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => { setEditingRegra(regra); setShowForm(true); }}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteRegraMutation.mutate(regra.id)}>
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="feriados">
              <FeriadosLibrary escritorio_id={escritorio?.id} />
            </TabsContent>

            <TabsContent value="ia" className="space-y-4">
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    Análise Inteligente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {regrasMaisUsadas.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2">Regras Mais Aplicadas</p>
                      <div className="space-y-2">
                        {regrasMaisUsadas.map(r => (
                          <div key={r.id} className="flex items-center justify-between p-2 bg-white rounded">
                            <span className="text-sm">{r.nome}</span>
                            <Badge variant="outline">{r.vezes_aplicada}x</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {regrasMaisEficientes.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2">Regras Mais Eficientes</p>
                      <div className="space-y-2">
                        {regrasMaisEficientes.map(r => (
                          <div key={r.id} className="flex items-center justify-between p-2 bg-white rounded">
                            <span className="text-sm">{r.nome}</span>
                            <Badge className="bg-green-100 text-green-800">{r.taxa_sucesso}%</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {sugestoesIA.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2">Sugestões de Regras</p>
                      <p className="text-xs text-slate-600 mb-2">
                        Tipos de prazo usados mas sem regra cadastrada:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {sugestoesIA.map(tipo => (
                          <Badge key={tipo} className="bg-amber-100 text-amber-800">+ {tipo}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {showForm && (
        <RegrasPrazoForm
          regra={editingRegra}
          escritorio_id={escritorio?.id}
          onClose={() => { setShowForm(false); setEditingRegra(null); }}
          onSuccess={() => { setShowForm(false); setEditingRegra(null); queryClient.invalidateQueries(['regras-prazo']); }}
        />
      )}
    </div>
  );
}