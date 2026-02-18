import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

export default function CommentForm({ postId, parentId, onSubmit, onCancel }) {
  const [form, setForm] = useState({ autor_nome: '', autor_email: '', conteudo: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ ...form, post_id: postId, parent_id: parentId });
    setForm({ autor_nome: '', autor_email: '', conteudo: '' });
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Input
          placeholder="Seu nome"
          value={form.autor_nome}
          onChange={(e) => setForm({ ...form, autor_nome: e.target.value })}
          required
          className="text-sm"
        />
        <Input
          type="email"
          placeholder="Seu email"
          value={form.autor_email}
          onChange={(e) => setForm({ ...form, autor_email: e.target.value })}
          required
          className="text-sm"
        />
      </div>
      <Textarea
        placeholder="Escreva seu comentário..."
        value={form.conteudo}
        onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
        required
        className="min-h-[80px] text-sm"
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={loading} size="sm">
          <Send className="w-4 h-4 mr-2" />
          {loading ? 'Enviando...' : 'Enviar'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} size="sm">
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}