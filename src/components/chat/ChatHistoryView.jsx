import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import ChatHistorySearch from './ChatHistorySearch';
import ChatHistoryItem from './ChatHistoryItem';

export default function ChatHistoryView({ user, onSelectConversa }) {
  const [conversas, setConversas] = useState([]);
  const [filteredConversas, setFilteredConversas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadHistory();
  }, [user]);

  const loadHistory = async () => {
    let data;
    if (user.role === 'admin') {
      data = await base44.entities.Conversa.list('-ultima_atualizacao', 50);
    } else {
      data = await base44.entities.Conversa.filter(
        { cliente_email: user.email },
        '-ultima_atualizacao'
      );
    }
    setConversas(data);
    setFilteredConversas(data);
    setLoading(false);
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredConversas(conversas);
      return;
    }
    const filtered = conversas.filter(c => 
      c.cliente_nome?.toLowerCase().includes(query.toLowerCase()) ||
      c.cliente_email?.toLowerCase().includes(query.toLowerCase()) ||
      c.ultima_mensagem?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredConversas(filtered);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-[var(--text-secondary)] text-sm">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ChatHistorySearch onSearch={handleSearch} />
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredConversas.map(c => (
          <ChatHistoryItem key={c.id} conversa={c} onClick={() => onSelectConversa(c)} />
        ))}
        {filteredConversas.length === 0 && (
          <p className="text-[var(--text-secondary)] text-center py-8 text-sm">
            Nenhuma conversa encontrada
          </p>
        )}
      </div>
    </div>
  );
}