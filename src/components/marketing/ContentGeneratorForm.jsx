import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const CONTENT_TYPES = [
  { value: 'blog', label: 'Artigo de Blog' },
  { value: 'social', label: 'Post Redes Sociais' },
  { value: 'ad', label: 'Anúncio Publicitário' },
  { value: 'email', label: 'Email Marketing' }
];

const PLATFORMS = {
  blog: [{ value: 'site', label: 'Site/Blog' }],
  social: [
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'Twitter/X' }
  ],
  ad: [
    { value: 'google', label: 'Google Ads' },
    { value: 'meta', label: 'Meta Ads' }
  ],
  email: [{ value: 'newsletter', label: 'Newsletter' }]
};

export default function ContentGeneratorForm({ onGenerate, loading }) {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: { tipo: 'blog', plataforma: 'site' }
  });

  const tipoSelecionado = watch('tipo');

  return (
    <form onSubmit={handleSubmit(onGenerate)} className="space-y-4">
      <div>
        <Label>Tipo de Conteúdo</Label>
        <Select 
          value={tipoSelecionado} 
          onValueChange={(v) => {
            setValue('tipo', v);
            setValue('plataforma', PLATFORMS[v][0].value);
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CONTENT_TYPES.map(t => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Plataforma</Label>
        <Select {...register('plataforma')}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PLATFORMS[tipoSelecionado]?.map(p => (
              <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Tópico/Assunto</Label>
        <Input {...register('topico', { required: true })} placeholder="Ex: Direitos do consumidor superendividado" />
      </div>

      <div>
        <Label>Instruções Adicionais (opcional)</Label>
        <Textarea {...register('instrucoes')} placeholder="Tom, estilo, palavras-chave..." rows={3} />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        Gerar Conteúdo
      </Button>
    </form>
  );
}