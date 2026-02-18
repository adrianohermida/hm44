import React, { useState, useEffect, useCallback, memo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useRealtimeSync } from './hooks/useRealtimeSync';
import MensagensHeader from './MensagensHeader';
import MensagensList from './MensagensList';
import MensagemInput from './MensagemInput';
import BagArquivos from './BagArquivos';
import CanalSelector from './CanalSelector';
import AISuggestionsButton from './AISuggestionsButton';

const UnifiedThreadPanel = memo(function UnifiedThreadPanel({ thread, onBack }) {
  const [mensagens, setMensagens] = useState([]);
  const [anexos, setAnexos] = useState([]);
  const [showBag, setShowBag] = useState(false);
  const [canalResposta, setCanalResposta] = useState(null);
  const [conteudoInput, setConteudoInput] = useState('');
  const queryClient = useQueryClient();

  useRealtimeSync(thread?.id);

  useEffect(() => {
    if (thread) {
      setCanalResposta(thread.canal);
    }
  }, [thread]);

  const isTicket = thread?.tipo === 'ticket';
  const entityName = isTicket ? 'TicketMensagem' : 'Mensagem';
  const foreignKey = isTicket ? 'ticket_id' : 'conversa_id';

  useEffect(() => {
    if (thread) {
      loadMensagens();
    }
  }, [thread?.id]);

  const loadMensagens = async () => {
    if (!thread) return;
    
    const msgs = await base44.entities[entityName]
      .filter({ [foreignKey]: thread.id });
    
    const sortedMsgs = msgs.sort((a, b) => 
      new Date(a.created_date) - new Date(b.created_date)
    );
    
    setMensagens(sortedMsgs);
  };

  const enviarMutation = useMutation({
    mutationFn: async ({ conteudo, anexos }) => {
      const user = await base44.auth.me();
      
      if (!user.escritorio_id) {
        throw new Error('Usuário sem escritório associado');
      }
      
      return base44.entities[entityName].create({
        [foreignKey]: thread.id,
        remetente_email: user.email,
        remetente_nome: user.full_name,
        tipo_remetente: 'admin',
        conteudo,
        anexos: anexos.length > 0 ? anexos : undefined,
        escritorio_id: user.escritorio_id
      });
    },
    onSuccess: () => {
      loadMensagens();
      setAnexos([]);
      queryClient.invalidateQueries(['unified-threads']);
      queryClient.invalidateQueries(['mensagens', thread.id]);
      toast.success('Mensagem enviada');
    },
    onError: (error) => {
      toast.error('Erro ao enviar mensagem: ' + error.message);
    }
  });

  const handleEnviar = useCallback((conteudo) => {
    enviarMutation.mutate({ conteudo, anexos });
    setConteudoInput('');
  }, [enviarMutation, anexos]);

  const handleSelectSuggestion = useCallback((suggestion) => {
    setConteudoInput(suggestion);
  }, []);

  const handleAnexoAdicionado = useCallback((anexo) => {
    setAnexos(prev => [...prev, anexo]);
  }, []);

  const handleRemoverAnexo = useCallback((idx) => {
    setAnexos(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const handleToggleBag = useCallback(() => {
    setShowBag(prev => !prev);
  }, []);

  if (!thread) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Selecione uma conversa para visualizar
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma conversa selecionada</h3>
        <p className="text-sm text-gray-600">Selecione uma conversa da lista para visualizar as mensagens</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {onBack && (
        <div className="md:hidden border-b bg-white">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onBack}
            className="gap-2 px-2 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Voltar</span>
          </Button>
        </div>
      )}
      <MensagensHeader
        conversa={thread.raw}
        anexosCount={anexos.length}
        onToggleBag={handleToggleBag}
        compact
      />
      
      <MensagensList mensagens={mensagens} />
      
      <div className="border-t p-2 bg-gray-50">
        <AISuggestionsButton
          mensagens={mensagens}
          onSelectSuggestion={handleSelectSuggestion}
        />
      </div>

      <MensagemInput
        onEnviar={handleEnviar}
        onAnexoAdicionado={handleAnexoAdicionado}
        loading={enviarMutation.isPending}
        value={conteudoInput}
        onChange={setConteudoInput}
        compact
      />

      {showBag && (
        <BagArquivos
          arquivos={anexos}
          onRemover={handleRemoverAnexo}
          onClose={handleToggleBag}
        />
      )}
    </div>
  );
});

export default UnifiedThreadPanel;