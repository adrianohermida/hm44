import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import Breadcrumb from '@/components/seo/Breadcrumb';
import FaturasHeader from '@/components/faturas/FaturasHeader';
import FaturasOverview from '@/components/faturas/FaturasOverview';
import FaturasSidebar from '@/components/faturas/FaturasSidebar';
import FaturaDetail from '@/components/faturas/FaturaDetail';
import PacotesCreditosGrid from '@/components/fatura/PacotesCreditosGrid';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Menu } from 'lucide-react';
import ResumeLoader from '@/components/common/ResumeLoader';

export default function Faturas() {
  const [activeTab, setActiveTab] = useState('faturas');
  const [honorarios, setHonorarios] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFatura, setSelectedFatura] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      
      let data;
      if (userData.role === 'admin') {
        const allHonorarios = await base44.entities.Honorario.list('-updated_date', 100);
        const escritorioId = '6948bed65e7da7a1c1eb64d1';
        data = allHonorarios.filter(h => h.escritorio_id === escritorioId);
      } else {
        data = await base44.entities.Honorario.filter({ cliente_email: userData.email }, '-updated_date');
      }
      
      setHonorarios(data);
      if (data.length > 0) setSelectedFatura(data[0]);
    } catch (error) {
      console.error('Erro ao carregar faturas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ResumeLoader />;

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-secondary)] overflow-hidden">
      <div className="flex-shrink-0 p-4 md:p-6 border-b border-[var(--border-primary)] bg-[var(--bg-elevated)]">
        <Breadcrumb items={[{ label: 'Faturas' }]} />
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <FaturasHeader isAdmin={user?.role === 'admin'} />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        {user?.role === 'admin' && (
          <Tabs defaultValue="honorarios" className="mb-6">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="honorarios">Honorários</TabsTrigger>
              <TabsTrigger value="creditos">Créditos API</TabsTrigger>
            </TabsList>
            <TabsContent value="honorarios">
              <FaturasOverview honorarios={honorarios} />
            </TabsContent>
            <TabsContent value="creditos">
              <PacotesCreditosGrid />
            </TabsContent>
          </Tabs>
        )}
        {user?.role !== 'admin' && <FaturasOverview honorarios={honorarios} />}
      </div>

      <div className="flex-1 flex overflow-hidden">
        <FaturasSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          honorarios={honorarios}
          selected={selectedFatura}
          onSelect={(f) => { setSelectedFatura(f); setSidebarOpen(false); }}
        />
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <FaturaDetail fatura={selectedFatura} />
        </div>
      </div>
    </div>
  );
}