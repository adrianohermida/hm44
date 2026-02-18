import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Clock, Brain, CheckCircle, BookOpen } from 'lucide-react';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { createPageUrl } from '@/utils';
import CalculoPrazosPanel from '@/components/prazos/CalculoPrazosPanel';
import PrazosAprovacao from '@/components/prazos/PrazosAprovacao';
import BibliotecaPrazos from '@/components/prazos/BibliotecaPrazos';

export default function CalculoPrazos() {
  const [activeTab, setActiveTab] = useState('calcular');
  const [showBiblioteca, setShowBiblioteca] = useState(false);

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const escritorios = await base44.entities.Escritorio.list();
      return escritorios[0];
    }
  });

  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me()
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb 
          items={[
            { label: 'Configurações', url: createPageUrl('Configuracoes') },
            { label: 'Cálculo de Prazos' }
          ]} 
        />
        
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                Cálculo Automático de Prazos
              </h1>
              <p className="text-[var(--text-secondary)] mt-2">
                Geração inteligente de prazos processuais com IA
              </p>
            </div>
            <Button onClick={() => setShowBiblioteca(true)} variant="outline">
              <BookOpen className="w-4 h-4 mr-2" />
              Biblioteca de Prazos
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="calcular">
              <Calculator className="w-4 h-4 mr-2" />
              Calcular
            </TabsTrigger>
            <TabsTrigger value="aprovacao">
              <CheckCircle className="w-4 h-4 mr-2" />
              Aprovação
            </TabsTrigger>
            <TabsTrigger value="config">
              <Clock className="w-4 h-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calcular">
            <CalculoPrazosPanel workspace={escritorio} darkMode={false} />
          </TabsContent>

          <TabsContent value="aprovacao">
            <PrazosAprovacao 
              workspaceId={escritorio?.id}
              userRole={user?.role}
              userEmail={user?.email}
              darkMode={false}
            />
          </TabsContent>

          <TabsContent value="config">
            <Card className="p-6 text-center">
              <p className="text-[var(--text-secondary)] mb-4">
                Configure regras de prazos e feriados na Biblioteca
              </p>
              <Button onClick={() => setShowBiblioteca(true)}>
                <BookOpen className="w-4 h-4 mr-2" />
                Abrir Biblioteca de Prazos
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {showBiblioteca && <BibliotecaPrazos onClose={() => setShowBiblioteca(false)} />}
    </div>
  );
}