import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Search } from 'lucide-react';

export default function CompetitiveAnalysisForm({ onAnalyze, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const validateURL = (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return 'URL inválida';
    }
  };

  return (
    <form onSubmit={handleSubmit((data) => onAnalyze(data.url))} className="space-y-4">
      <div>
        <Label>URL do Concorrente</Label>
        <Input 
          {...register('url', { required: 'URL obrigatória', validate: validateURL })}
          placeholder="https://escritorio-concorrente.com.br"
          className="text-base"
        />
        {errors.url && <p className="text-sm text-red-600 mt-1">{errors.url.message}</p>}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg text-sm text-gray-700">
        <p className="font-semibold mb-2">A análise inclui:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Palavras-chave principais do site</li>
          <li>Tópicos de artigos mais populares</li>
          <li>Lacunas de conteúdo (oportunidades)</li>
          <li>Sugestões de tópicos para seu blog</li>
        </ul>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
        Analisar Concorrente
      </Button>
    </form>
  );
}