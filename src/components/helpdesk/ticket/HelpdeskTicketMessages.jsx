import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import HelpdeskMessageItem from './HelpdeskMessageItem';
import EmailThreadView from '../email/EmailThreadView';
import { Loader2 } from 'lucide-react';
import { helpdeskCacheConfig } from '../performance/HelpdeskCacheConfig';
import { motion, AnimatePresence } from 'framer-motion';

export default function HelpdeskTicketMessages({ ticketId, showThread = false }) {
  const scrollRef = useRef(null);

  const { data: mensagens = [], isLoading } = useQuery({
    queryKey: ['ticket-mensagens', ticketId],
    queryFn: () => base44.entities.TicketMensagem.filter({ ticket_id: ticketId }),
    enabled: !!ticketId,
    ...helpdeskCacheConfig.ticketMensagens
  });

  const { data: typingData } = useQuery({
    queryKey: ['typing', ticketId],
    queryFn: async () => {
      const response = await base44.functions.invoke('typingIndicator', { 
        action: 'check', 
        ticket_id: ticketId 
      });
      return response.data;
    },
    enabled: !!ticketId,
    refetchInterval: 2000
  });

  const mensagensOrdenadas = mensagens
    .sort((a, b) => new Date(a.created_date) - new Date(b.created_date));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensagens.length]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--brand-primary)]" />
      </div>
    );
  }

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
    >
      <AnimatePresence mode="popLayout">
        {mensagensOrdenadas.map((mensagem, index) => (
          <motion.div
            key={mensagem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
          >
            {mensagem.canal === 'email' && showThread ? (
              <EmailThreadView mensagem={mensagem} showThread={true} />
            ) : (
              <HelpdeskMessageItem mensagem={mensagem} />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      
      <AnimatePresence>
        {typingData?.typing && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] italic px-4 py-2"
          >
            <div className="flex gap-1">
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                className="w-1.5 h-1.5 bg-[var(--brand-primary)] rounded-full"
              />
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                className="w-1.5 h-1.5 bg-[var(--brand-primary)] rounded-full"
              />
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                className="w-1.5 h-1.5 bg-[var(--brand-primary)] rounded-full"
              />
            </div>
            {typingData.typing.user_email} está digitando...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}