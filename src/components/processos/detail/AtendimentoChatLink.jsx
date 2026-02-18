import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';

export default function AtendimentoChatLink({ clienteId, processoId }) {
  const navigate = useNavigate();

  const handleChat = () => {
    navigate(`${createPageUrl('Comunicacao')}?clienteId=${clienteId}&processoId=${processoId}`);
  };

  return (
    <Button size="sm" variant="outline" onClick={handleChat} className="w-full">
      <MessageSquare className="w-4 h-4 mr-2" />
      Abrir Chat com Cliente
    </Button>
  );
}