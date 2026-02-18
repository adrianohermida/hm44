import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import { MessageSquare } from 'lucide-react';

export default function CommentSection({ postId }) {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState(null);

  React.useEffect(() => {
    base44.auth.me().then(setCurrentUser).catch(() => {});
  }, []);

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => base44.entities.BlogComment.filter({ post_id: postId, status: 'aprovado' }, '-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.BlogComment.create(data),
    onSuccess: () => queryClient.invalidateQueries(['comments', postId]),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.BlogComment.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['comments', postId]),
  });

  const handleLike = (commentId) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      updateMutation.mutate({ id: commentId, data: { likes: (comment.likes || 0) + 1 } });
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-[var(--brand-primary)]" />
        <h3 className="text-lg font-bold">Comentários ({comments.length})</h3>
      </div>
      
      <CommentForm postId={postId} onSubmit={(data) => createMutation.mutate(data)} />
      
      <div className="space-y-4">
        {comments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={(data) => createMutation.mutate(data)}
            onLike={handleLike}
            isAdmin={isAdmin}
            onApprove={(id) => updateMutation.mutate({ id, data: { status: 'aprovado' } })}
          />
        ))}
      </div>
    </div>
  );
}