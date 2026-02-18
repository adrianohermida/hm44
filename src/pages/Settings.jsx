import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Breadcrumb from '@/components/seo/Breadcrumb';
import SettingsHeader from '@/components/settings/SettingsHeader';
import IntegrationSection from '@/components/settings/IntegrationSection';
import CalendarSettings from '@/components/settings/CalendarSettings';
import EmailPreferences from '@/components/settings/EmailPreferences';

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const urlParams = new URLSearchParams(window.location.search);
  const defaultTab = urlParams.get('tab') || 'preferences';

  useEffect(() => {
    loadUser();
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = () => {
    const oauthSuccess = urlParams.get('oauth_success');
    const oauthError = urlParams.get('error');
    
    if (oauthSuccess === 'true') {
      toast.success('Integração conectada com sucesso!');
      window.history.replaceState({}, '', window.location.pathname);
      setTimeout(() => window.location.reload(), 1000);
    } else if (oauthError) {
      toast.error(`Erro na integração: ${oauthError}`);
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const loadUser = async () => {
    const currentUser = await base44.auth.me();
    setUser(currentUser);
    setLoading(false);
  };

  if (loading) return null;

  const isAdmin = user?.role === 'admin' || user?.email === 'adrianohermida@gmail.com';

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb 
          items={[
            { label: 'Configurações', url: createPageUrl('Configuracoes') },
            { label: 'Geral' }
          ]} 
        />
        <SettingsHeader userName={user?.full_name} />
        
        <Tabs defaultValue={defaultTab} className="mt-6">
          <TabsList>
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="calendar">Agenda</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="preferences" className="mt-6">
            <EmailPreferences 
              userEmail={user?.email} 
              escritorioId={user?.escritorio_id || '6948bed65e7da7a1c1eb64d1'} 
            />
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <IntegrationSection />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="calendar" className="mt-6">
              <CalendarSettings user={user} onUpdate={loadUser} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}