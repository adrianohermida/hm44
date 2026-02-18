import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Save, Settings, LogOut, Download, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import ResumeLoader from '@/components/common/ResumeLoader';
import SingleHandNav from '@/components/mobile/SingleHandNav';
import AvatarUpload from '@/components/profile/AvatarUpload';
import DadosPessoais from '@/components/profile/DadosPessoais';
import RedesSociaisPessoais from '@/components/profile/RedesSociaisPessoais';
import InscricoesOABPessoais from '@/components/profile/InscricoesOABPessoais';

export default function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('dados');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
    gcTime: 1000 * 60 * 5
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao atualizar perfil');
    }
  });

  const handleExportData = async () => {
    const data = { usuario: user };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `perfil-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleChange = (field, value) => {
    setFormData({...formData, [field]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) return <ResumeLoader />;
  if (!user) return navigate(createPageUrl("Home"));

  const navItems = [
    { id: 'dados', label: 'Dados Pessoais', icon: User },
    { id: 'redes', label: 'Redes Sociais', icon: User },
    { id: 'oab', label: 'Inscrição OAB', icon: User },
    { id: 'seguranca', label: 'Segurança', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      {/* Header */}
      <div className="bg-[var(--bg-primary)] border-b border-[var(--border-primary)] p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(createPageUrl('MeuPainel'))}
              className="gap-2 text-[var(--brand-primary)]"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Meu Perfil
            </h1>
          </div>
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-[var(--brand-primary)] text-sm"
            >
              Editar Perfil
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  setFormData(user);
                }}
                size="sm"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={updateMutation.isPending}
                className="bg-[var(--brand-primary)] text-sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Tab Nav */}
      <div className="md:hidden border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto">
          <SingleHandNav
            items={navItems}
            activeId={activeTab}
            onChange={setActiveTab}
          />
        </div>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:block border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`py-3 px-4 border-b-2 transition-colors ${
                activeTab === item.id
                  ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 md:p-6 pb-24 md:pb-6 space-y-6">
        {/* Dados Pessoais Tab */}
        {activeTab === 'dados' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-1">
              <Card className="bg-[var(--bg-elevated)]">
                <CardContent className="p-4 sm:p-6">
                  <AvatarUpload 
                    user={formData} 
                    onChange={handleChange} 
                    disabled={!isEditing} 
                  />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="bg-[var(--bg-elevated)]">
                <CardContent className="p-4 sm:p-6">
                  <DadosPessoais 
                    data={formData} 
                    onChange={handleChange} 
                    disabled={!isEditing} 
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Redes Sociais Tab */}
        {activeTab === 'redes' && (
          <Card className="bg-[var(--bg-elevated)]">
            <CardContent className="p-4 sm:p-6">
              <RedesSociaisPessoais 
                data={formData} 
                onChange={handleChange} 
                disabled={!isEditing} 
              />
            </CardContent>
          </Card>
        )}

        {/* OAB Tab */}
        {activeTab === 'oab' && (
          <Card className="bg-[var(--bg-elevated)]">
            <CardContent className="p-4 sm:p-6">
              <InscricoesOABPessoais 
                data={formData} 
                onChange={handleChange} 
                disabled={!isEditing} 
              />
            </CardContent>
          </Card>
        )}

        {/* Segurança Tab */}
        {activeTab === 'seguranca' && (
          <Card className="bg-[var(--bg-elevated)]">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-[var(--text-primary)]">Segurança</h3>
              <div className="space-y-4">
                <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                  <p className="text-sm text-[var(--text-secondary)] mb-3">
                    Exportar dados pessoais para arquivo seguro
                  </p>
                  <Button 
                    onClick={handleExportData}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Dados
                  </Button>
                </div>
                <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                  <p className="text-sm text-[var(--text-secondary)] mb-3">
                    Sair da sua conta
                  </p>
                  <Button 
                    onClick={() => base44.auth.logout(createPageUrl('Home'))}
                    variant="destructive"
                    size="sm"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}