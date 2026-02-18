import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import ConversasSidebar from './ConversasSidebar';
import MensagensPanel from './MensagensPanel';

export default function ConversasView() {
  const [conversas, setConversas] = useState([]);
  const [selected, setSelected] = useState(null);
  const [canal, setCanal] = useState('todos');
  const [tipo, setTipo] = useState('todas');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    loadConversas();
  }, [canal, tipo]);

  const loadConversas = async () => {
    const user = await base44.auth.me();
    let data;
    if (user.role === 'admin') {
      const filtro = {};
      if (canal !== 'todos') filtro.canal = canal;
      // INCLUIR visitantes: comentar filtro tipo para admin ver TODOS leads
      // if (tipo !== 'todas') filtro.tipo = tipo;
      data = await base44.entities.Conversa.filter(filtro, '-ultima_atualizacao', 50);
    } else {
      const filtro = { cliente_email: user.email };
      if (canal !== 'todos') filtro.canal = canal;
      data = await base44.entities.Conversa.filter(filtro, '-ultima_atualizacao');
    }
    setConversas(data);
    setLoading(false);
  };

  return (
    <div className="flex h-full gap-0 bg-[var(--bg-primary)]">
      <ConversasSidebar
        conversas={conversas}
        selected={selected}
        onSelect={setSelected}
        canal={canal}
        setCanal={setCanal}
        tipo={tipo}
        setTipo={setTipo}
        loading={loading}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <MensagensPanel
        conversa={selected}
        onMensagemEnviada={loadConversas}
      />
    </div>
  );
}