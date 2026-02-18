import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import MensagensHeader from './MensagensHeader';
import MensagensList from './MensagensList';
import MensagemInput from './MensagemInput';
import BagArquivos from './BagArquivos';

export default function MensagensPanel({ conversa, onMensagemEnviada }) {
  const [mensagens, setMensagens] = useState([]);
  const [anexos, setAnexos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);

  useEffect(() => {
    if (conversa) {
      loadMensagens();
      setAnexos([]);
    }
  }, [conversa]);

  const loadMensagens = async () => {
    setLoading(true);
    const data = await base44.entities.Mensagem.filter(
      { conversa_id: conversa.id }, 
      'created_date'
    );
    setMensagens(data);
    setLoading(false);
  };

  const handleEnviar = async (texto, novosAnexos = []) => {
    const user = await base44.auth.me();
    const mensagemData = {
      conversa_id: conversa.id,
      remetente_email: user.email,
      remetente_nome: user.full_name,
      tipo_remetente: 'admin',
      conteudo: texto,
      escritorio_id: conversa.escritorio_id
    };
    
    if (novosAnexos.length > 0) {
      mensagemData.anexos = novosAnexos;
      setAnexos([...anexos, ...novosAnexos]);
    }
    
    await base44.entities.Mensagem.create(mensagemData);
    await loadMensagens();
    onMensagemEnviada();
  };

  const handleAnexoAdicionado = (anexo) => {
    setAnexos([...anexos, anexo]);
    if (!bagOpen) setBagOpen(true);
  };

  const handleRemoverAnexo = (index) => {
    setAnexos(anexos.filter((_, i) => i !== index));
  };

  if (!conversa) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--bg-secondary)]">
        <p className="text-[var(--text-secondary)]">Selecione uma conversa</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      <div className="flex-1 flex flex-col bg-[var(--bg-primary)]">
        <MensagensHeader
          conversa={conversa}
          anexosCount={anexos.length}
          onToggleBag={() => setBagOpen(!bagOpen)}
        />
        
        <MensagensList mensagens={mensagens} />
        
        <MensagemInput
          onEnviar={handleEnviar}
          onAnexoAdicionado={handleAnexoAdicionado}
        />
      </div>
      
      <BagArquivos
        anexos={anexos}
        onRemover={handleRemoverAnexo}
        isOpen={bagOpen}
        onClose={() => setBagOpen(false)}
      />
    </div>
  );
}