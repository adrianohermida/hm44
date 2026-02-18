import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, MessageSquare, Phone, Clock, CheckCircle, Archive, MoreVertical, Bot } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function HelpdeskTicketListItem({ 
  ticket, 
  isSelected, 
  onSelect, 
  isChecked, 
  onCheck,
  onResolve,
  onArchive,
  onClassificar
}) {
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const backgroundColor = useTransform(
    x,
    [-100, 0, 100],
    ['rgb(34 197 94)', 'rgb(255 255 255)', 'rgb(156 163 175)']
  );

  const statusColors = {
    triagem: 'bg-purple-100 text-purple-700',
    aberto: 'bg-blue-100 text-blue-700',
    em_atendimento: 'bg-yellow-100 text-yellow-700',
    aguardando_cliente: 'bg-orange-100 text-orange-700',
    resolvido: 'bg-green-100 text-green-700',
    fechado: 'bg-gray-100 text-gray-700'
  };

  const prioridadeColors = {
    urgente: 'bg-red-100 text-red-700',
    alta: 'bg-orange-100 text-orange-700',
    media: 'bg-blue-100 text-blue-700',
    baixa: 'bg-gray-100 text-gray-700'
  };

  const canalIcons = {
    email: Mail,
    chat: MessageSquare,
    whatsapp: MessageSquare,
    telefone: Phone
  };

  const CanalIcon = canalIcons[ticket.canal] || Mail;

  const handleDragEnd = (event, { offset }) => {
    setIsDragging(false);
    if (offset.x < -80 && onResolve) {
      onResolve(ticket.id);
    } else if (offset.x > 80 && onArchive) {
      onArchive(ticket.id);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Swipe Actions Background */}
      <div className="absolute inset-0 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">Resolver</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-sm font-medium hidden sm:inline">Arquivar</span>
          <Archive className="w-5 h-5" />
        </div>
      </div>

      {/* Draggable Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -120, right: 120 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ x, backgroundColor }}
        className={`relative p-3 rounded-lg transition-all cursor-grab active:cursor-grabbing ${
          isSelected
            ? 'bg-[var(--brand-primary)] text-white shadow-md'
            : 'hover:bg-[var(--bg-tertiary)] bg-white border border-[var(--border-primary)]'
        } ${isDragging ? 'shadow-lg' : ''}`}
      >
        <div className="flex items-start gap-2">
          <Checkbox
            checked={isChecked}
            onCheckedChange={(checked) => onCheck(ticket.id, checked)}
            onClick={(e) => e.stopPropagation()}
            className={isSelected ? 'border-white data-[state=checked]:bg-white data-[state=checked]:text-[var(--brand-primary)]' : ''}
          />

          <button
            onClick={onSelect}
            disabled={isDragging}
            className="flex-1 text-left min-w-0"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-medium text-sm line-clamp-1 flex-1">
                {ticket.titulo}
              </h4>
              <CanalIcon className="w-4 h-4 flex-shrink-0" />
            </div>

            <p className={`text-xs mb-2 line-clamp-1 ${isSelected ? 'text-white/80' : 'text-[var(--text-secondary)]'}`}>
              {ticket.cliente_nome || ticket.cliente_email}
            </p>

            <div className="flex items-center gap-1 flex-wrap">
              <Badge className={isSelected ? 'bg-white/20 text-white' : statusColors[ticket.status]}>
                {ticket.status}
              </Badge>
              {ticket.prioridade === 'urgente' && (
                <Badge className={isSelected ? 'bg-white/20 text-white' : prioridadeColors.urgente}>
                  Urgente
                </Badge>
              )}
            </div>

            <div className={`flex items-center gap-1 text-xs mt-2 ${isSelected ? 'text-white/70' : 'text-[var(--text-tertiary)]'}`}>
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(ticket.updated_date || ticket.created_date), { 
                addSuffix: true, 
                locale: ptBR 
              })}
            </div>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-6 w-6 p-0 ${isSelected ? 'hover:bg-white/20' : ''}`}
              >
                <MoreVertical className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onClassificar?.(ticket)}>
                <Bot className="w-4 h-4 mr-2" />
                Classificar IA
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>
    </div>
  );
}