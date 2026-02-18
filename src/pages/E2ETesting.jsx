import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import Breadcrumb from '@/components/seo/Breadcrumb';
import TestSection from '@/components/e2e/TestSection';
import TestResult from '@/components/e2e/TestResult';
import FixProcessosPanel from '@/components/e2e/FixProcessosPanel';
import { Loader2, Shield } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function E2ETesting() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const runTest = async (testName) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    try {
      const response = await base44.functions.invoke('runE2ETest', { testName });
      setResults(prev => ({ ...prev, [testName]: response.data }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [testName]: { success: false, error: error.message } 
      }));
    }
    setLoading(prev => ({ ...prev, [testName]: false }));
  };

  const tests = [
    { id: 'user_info', name: '🔍 Info do Usuário', description: 'Mostra informações do usuário logado e escritórios disponíveis' },
    { id: 'fix_escritorio', name: '🔧 Corrigir Escritório', description: 'Atribui um escritório ao usuário admin (necessário para testes)' },
    { id: 'fix_processos_escritorio', name: '🔧 Corrigir Processos', description: 'Corrige escritorio_id e padroniza processo_id=numero_cnj em todos os processos' },
    { id: 'fix_tickets_escritorio', name: '🔧 Corrigir Tickets', description: 'Migra tickets com escritorio_id "default" para o escritório correto' },
    { id: 'fix_conversas_escritorio', name: '🔧 Corrigir Conversas', description: 'Migra conversas com escritorio_id "default" para o escritório correto' },
    { id: 'testChatIntegration', name: '💬 Chat Widget', description: 'Testa Chat: Conversa + Mensagem + Query Unificada' },
    { id: 'testWhatsAppIntegration', name: '📱 WhatsApp', description: 'Testa WhatsApp: Conversa + WAMID + Status + Query' },
    { id: 'testEmailIntegration', name: '📧 Email Inbound', description: 'Testa Email: Ticket + TicketMensagem + Thread ID + Query' },
    { id: 'testTicketsIntegration', name: '🎫 Sistema Tickets', description: 'Testa Tickets: Criação + Escalação + Workflow + Query' },
    { id: 'multitenant_tickets', name: 'Isolamento Multitenant - Tickets', description: 'Verifica se tickets de um escritório não aparecem para outro' },
    { id: 'multitenant_conversas', name: 'Isolamento Multitenant - Conversas', description: 'Verifica isolamento de conversas entre escritórios' },
    { id: 'multitenant_emails', name: 'Isolamento Multitenant - E-mails', description: 'Verifica isolamento de preferências de e-mail' },
    { id: 'sendgrid_config', name: '📧 SendGrid - Configuração', description: 'Verifica se o SENDGRID_API_TOKEN está configurado e válido' },
    { id: 'sendgrid_inbound_parse', name: '📧 SendGrid - Inbound Parse', description: 'Verifica configuração do Inbound Parse (recebimento de emails)' },
    { id: 'sendgrid_send_email', name: '📧 SendGrid - Enviar Email', description: 'Testa envio real de email via SendGrid API (envia para seu email)' },
    { id: 'sendgrid_receive_email', name: '📧 SendGrid - Receber Email', description: 'Simula recebimento de email via webhook (testa função receiveEmail)' },
    { id: 'sendgrid_webhook', name: '📧 SendGrid - Webhook Eventos', description: 'Verifica se o webhook está recebendo eventos (delivered, opened, clicked)' },
    { id: 'sendgrid_full_flow', name: '📧 SendGrid - Fluxo Completo', description: 'Testa todo o fluxo: config → envio → recebimento → eventos' },
    { id: 'google_calendar_connection', name: 'Google Calendar - Conexão', description: 'Testa se a integração do Google Calendar está conectada' },
    { id: 'google_calendar_events', name: 'Google Calendar - Eventos', description: 'Testa leitura e criação de eventos no calendário' },
    { id: 'google_calendar_availability', name: 'Google Calendar - Disponibilidade', description: 'Testa consulta de horários disponíveis' },
    { id: 'comunicacao', name: '🔬 Comunicação - Functions', description: 'Testa TODAS as functions do módulo: chatbot, escalação, emails, WhatsApp' }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={[{ label: 'E2E Testing' }]} />
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Testes E2E - Plataforma</h1>
            <p className="text-[var(--text-secondary)]">Testes de isolamento multitenant e integrações</p>
          </div>
          <Link to={createPageUrl('AuditoriaNavegacao')}>
            <Button variant="outline">
              <Shield className="w-4 h-4 mr-2" />
              Ir para Auditoria Brutal
            </Button>
          </Link>
        </div>

        {loading.all && (
          <Card className="p-4 mb-6 flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-[var(--brand-primary)]" />
            <span className="text-[var(--text-secondary)]">Executando testes...</span>
          </Card>
        )}

        <div className="space-y-6">
          <FixProcessosPanel />
          
          {tests.filter(t => t.id !== 'fix_processos_escritorio').map(test => (
            <TestSection
              key={test.id}
              test={test}
              loading={loading[test.id]}
              result={results[test.id]}
              onRun={() => runTest(test.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}