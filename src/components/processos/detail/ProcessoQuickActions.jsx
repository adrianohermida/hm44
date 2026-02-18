import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, DollarSign, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

export default function ProcessoQuickActions({ processoId, clienteId }) {
  const navigate = useNavigate();

  const handleGerarPeticao = () => {
    toast.info('Gerando petição com IA...');
  };

  return (
    <div className="flex flex-col gap-2">
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => navigate(`${createPageUrl('Audiencias')}?processo_id=${processoId}`)} 
        className="justify-start"
      >
        <Calendar className="w-4 h-4 mr-2" />Audiências
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => navigate(`${createPageUrl('Prazos')}?processo_id=${processoId}`)} 
        className="justify-start"
      >
        <FileText className="w-4 h-4 mr-2" />Prazos
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => navigate(`${createPageUrl('Financeiro')}?processo_id=${processoId}&cliente_id=${clienteId}`)} 
        className="justify-start"
      >
        <DollarSign className="w-4 h-4 mr-2" />Honorários
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={handleGerarPeticao} 
        className="justify-start"
      >
        <Sparkles className="w-4 h-4 mr-2" />Petição com IA
      </Button>
    </div>
  );
}