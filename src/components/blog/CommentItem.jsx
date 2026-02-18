import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Reply, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CommentForm from './CommentForm';

export default function CommentItem({ comment, onReply, onLike, isAdmin, onApprove }) {
  const [showReply, setShowReply] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--brand-primary-100)] flex items-center justify-center flex-shrink-0">
          <span className="text-[var(--brand-primary)] font-bold">
            {comment.autor_nome?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{comment.autor_nome}</span>
            <span className="text-xs text-[var(--text-tertiary)]">
              {format(new Date(comment.created_date), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
            </span>
            {comment.status === 'pendente' && (
              <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">Aguardando aprovação</span>
            )}
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-2">{comment.conteudo}</p>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => onLike(comment.id)} className="h-7 text-xs">
              <ThumbsUp className="w-3 h-3 mr-1" />
              {comment.likes || 0}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowReply(!showReply)} className="h-7 text-xs">
              <Reply className="w-3 h-3 mr-1" />
              Responder
            </Button>
            {isAdmin && comment.status === 'pendente' && (
              <Button variant="ghost" size="sm" onClick={() => onApprove(comment.id)} className="h-7 text-xs text-[var(--brand-success)]">
                <Shield className="w-3 h-3 mr-1" />
                Aprovar
              </Button>
            )}
          </div>
        </div>
      </div>
      {showReply && (
        <div className="ml-12 mt-3">
          <CommentForm
            postId={comment.post_id}
            parentId={comment.id}
            onSubmit={onReply}
            onCancel={() => setShowReply(false)}
          />
        </div>
      )}
    </div>
  );
}