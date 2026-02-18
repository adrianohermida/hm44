import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import MultiValueInput from './MultiValueInput';
import OABMultiInput from './OABMultiInput';
import CNJMultiInput from './CNJMultiInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TestProfileModal({ profile, endpoint, provedor, params, onSave, onClose }) {
  const [scope, setScope] = useState(profile?.provedor_id && !profile?.endpoint_id ? 'provedor' : 'endpoint');
  const [form, setForm] = useState({
    nome: profile?.nome || '',
    descricao: profile?.descricao || '',
    dados_teste: profile?.dados_teste || {
      cpfs: [],
      cnpjs: [],
      oabs: [],
      nomes: [],
      numeros_cnj: {}
    }
  });

  const handleSave = () => {
    // Validações com feedback
    if (!form.nome?.trim()) {
      toast.error('Nome do perfil é obrigatório');
      return;
    }
    if (!provedor?.id && !endpoint?.id) {
      toast.error('Provedor ou endpoint não encontrado');
      return;
    }

    const data = {
      id: profile?.id,
      ...form,
      parametros: params || {} // CRÍTICO: Salvar params atuais do formulário
    };
    
    if (scope === 'provedor') {
      data.provedor_id = provedor?.id || endpoint?.provedor_id;
      data.endpoint_id = null;
    } else {
      data.endpoint_id = endpoint?.id;
      data.provedor_id = null;
    }
    
    onSave(data);
    onClose();
  };

  const updateDadosTeste = (key, value) => {
    setForm({
      ...form,
      dados_teste: { ...form.dados_teste, [key]: value }
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{profile ? 'Editar' : 'Criar'} Perfil de Teste</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Escopo do Perfil</Label>
            <RadioGroup value={scope} onValueChange={setScope} className="flex gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="endpoint" id="endpoint" />
                <Label htmlFor="endpoint" className="font-normal">Este endpoint</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="provedor" id="provedor" />
                <Label htmlFor="provedor" className="font-normal">Todos endpoints do provedor</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label>Nome</Label>
            <Input
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Nome do perfil"
            />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Descrição opcional"
            />
          </div>

          <Tabs defaultValue="docs" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="docs">Documentos</TabsTrigger>
              <TabsTrigger value="oab">OAB</TabsTrigger>
              <TabsTrigger value="cnj">CNJ</TabsTrigger>
            </TabsList>

            <TabsContent value="docs" className="space-y-3">
              <MultiValueInput
                label="CPFs"
                values={form.dados_teste.cpfs}
                onChange={(v) => updateDadosTeste('cpfs', v)}
                placeholder="000.000.000-00"
              />
              <MultiValueInput
                label="CNPJs"
                values={form.dados_teste.cnpjs}
                onChange={(v) => updateDadosTeste('cnpjs', v)}
                placeholder="00.000.000/0000-00"
              />
              <MultiValueInput
                label="Nomes Completos"
                values={form.dados_teste.nomes}
                onChange={(v) => updateDadosTeste('nomes', v)}
                placeholder="Nome Completo"
              />
            </TabsContent>

            <TabsContent value="oab">
              <OABMultiInput
                values={form.dados_teste.oabs}
                onChange={(v) => updateDadosTeste('oabs', v)}
              />
            </TabsContent>

            <TabsContent value="cnj">
              <CNJMultiInput
                values={form.dados_teste.numeros_cnj}
                onChange={(v) => updateDadosTeste('numeros_cnj', v)}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.nome}>
              {profile ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}