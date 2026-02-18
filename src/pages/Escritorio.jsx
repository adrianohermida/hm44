import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Building2, Save } from 'lucide-react';
import { toast } from 'sonner';
import DadosBasicos from '@/components/escritorio/DadosBasicos';
import LogoUpload from '@/components/escritorio/LogoUpload';
import InscricoesOAB from '@/components/escritorio/InscricoesOAB';
import RedesSociais from '@/components/escritorio/RedesSociais';
import Contato from '@/components/escritorio/Contato';
import Unidades from '@/components/escritorio/Unidades';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Escritorio() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio, isLoading } = useQuery({
    queryKey: ['escritorio', user?.email],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0];
    },
    enabled: !!user
  });

  const [formData, setFormData] = useState({});

  React.useEffect(() => {
    if (escritorio) {
      setFormData(escritorio);
    }
  }, [escritorio]);

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Escritorio.update(escritorio.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['escritorio']);
      setIsEditing(false);
      toast.success('Dados atualizados com sucesso');
    },
    onError: () => {
      toast.error('Erro ao atualizar dados');
    }
  });

  const handleChange = (field, value) => {
    setFormData({...formData, [field]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <div className="border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <Breadcrumb items={[
            { label: 'Administração', url: createPageUrl('Administracao') },
            { label: 'Dados do Escritório' }
          ]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Building2 className="w-8 h-8 text-[var(--brand-primary)]" />
              Dados do Escritório
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">
              Gerencie as informações principais do escritório
            </p>
          </div>
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
            >
              Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                setIsEditing(false);
                setFormData(escritorio);
              }}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={updateMutation.isPending}
                className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <DadosBasicos data={formData} onChange={handleChange} disabled={!isEditing} />
            <LogoUpload logoUrl={formData.logo_url} onChange={handleChange} disabled={!isEditing} />
            <InscricoesOAB escritorioId={escritorio?.id} disabled={!isEditing} />
          </div>

          <div className="space-y-6">
            <Contato data={formData} onChange={handleChange} disabled={!isEditing} />
            <RedesSociais data={formData} onChange={handleChange} disabled={!isEditing} />

            <Card>
              <CardHeader>
                <CardTitle className="text-[var(--brand-primary)]">Endereço Principal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Logradouro"
                  value={formData.endereco || ''}
                  onChange={(e) => handleChange('endereco', e.target.value)}
                  disabled={!isEditing}
                />
                <div className="grid grid-cols-3 gap-3">
                  <Input placeholder="Cidade" value={formData.cidade || ''} onChange={(e) => handleChange('cidade', e.target.value)} disabled={!isEditing} />
                  <Input placeholder="UF" value={formData.estado || ''} onChange={(e) => handleChange('estado', e.target.value)} disabled={!isEditing} maxLength={2} />
                  <Input placeholder="CEP" value={formData.cep || ''} onChange={(e) => handleChange('cep', e.target.value)} disabled={!isEditing} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6">
          <Unidades escritorioId={escritorio?.id} disabled={!isEditing} />
        </div>
      </div>
    </div>
  );
}