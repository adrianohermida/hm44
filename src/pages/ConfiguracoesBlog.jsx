import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function ConfiguracoesBlog() {
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const queryClient = useQueryClient();

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const list = await base44.entities.Escritorio.list();
      return list[0];
    }
  });

  const { data: personas = [] } = useQuery({
    queryKey: ['personas', escritorio?.id],
    queryFn: () => base44.entities.PersonaBlog.filter({ escritorio_id: escritorio.id }),
    enabled: !!escritorio
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.PersonaBlog.create({ ...data, escritorio_id: escritorio.id }),
    onSuccess: () => {
      queryClient.invalidateQueries(['personas']);
      setShowForm(false);
      toast.success('Persona criada!');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PersonaBlog.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['personas']);
      setEditando(null);
      toast.success('Persona atualizada!');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.PersonaBlog.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['personas']);
      toast.success('Persona removida!');
    }
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Configurações do Blog</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Persona
        </Button>
      </div>

      {showForm && (
        <PersonaForm
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="grid gap-4">
        {personas.map(persona => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            isEditing={editando === persona.id}
            onEdit={() => setEditando(persona.id)}
            onSave={(data) => updateMutation.mutate({ id: persona.id, data })}
            onCancel={() => setEditando(null)}
            onDelete={() => deleteMutation.mutate(persona.id)}
          />
        ))}
      </div>
    </div>
  );
}

function PersonaForm({ persona, onSubmit, onCancel }) {
  const [form, setForm] = useState(persona || {
    nome: '',
    descricao: '',
    nivel_conhecimento: 'leigo',
    tom_voz: '',
    linguagem: '',
    objetivos: [],
    dores: []
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{persona ? 'Editar' : 'Nova'} Persona</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Nome</Label>
          <Input value={form.nome} onChange={(e) => setForm(p => ({ ...p, nome: e.target.value }))} />
        </div>
        <div>
          <Label>Descrição</Label>
          <Textarea value={form.descricao} onChange={(e) => setForm(p => ({ ...p, descricao: e.target.value }))} rows={3} />
        </div>
        <div>
          <Label>Nível Conhecimento</Label>
          <Select value={form.nivel_conhecimento} onValueChange={(v) => setForm(p => ({ ...p, nivel_conhecimento: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="leigo">Leigo</SelectItem>
              <SelectItem value="intermediario">Intermediário</SelectItem>
              <SelectItem value="avancado">Avançado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Tom de Voz</Label>
          <Input value={form.tom_voz} onChange={(e) => setForm(p => ({ ...p, tom_voz: e.target.value }))} placeholder="Ex: empático, técnico, didático" />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onSubmit(form)}>Salvar</Button>
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PersonaCard({ persona, isEditing, onEdit, onSave, onCancel, onDelete }) {
  if (isEditing) {
    return <PersonaForm persona={persona} onSubmit={onSave} onCancel={onCancel} />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {persona.nome}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{persona.descricao}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onEdit}>Editar</Button>
            <Button size="sm" variant="ghost" onClick={onDelete} className="text-red-600">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Badge>{persona.nivel_conhecimento}</Badge>
          {persona.tom_voz && <Badge variant="outline">{persona.tom_voz}</Badge>}
        </div>
      </CardContent>
    </Card>
  );
}