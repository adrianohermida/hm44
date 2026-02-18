import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RefreshCw, Check, AlertTriangle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const removerAcentos = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const removerStopwords = (str) => {
  const stopwords = ['a', 'o', 'de', 'da', 'do', 'em', 'na', 'no', 'para', 'com', 'por', 'e', 'ou'];
  const palavras = str.split('-');
  return palavras.filter(p => !stopwords.includes(p) || palavras.indexOf(p) === 0).join('-');
};

export const gerarSlug = (titulo, palavraChave = '') => {
  let slug = titulo.toLowerCase();
  slug = removerAcentos(slug);
  slug = slug.replace(/[^a-z0-9\s-]/g, '');
  slug = slug.trim().replace(/\s+/g, '-');
  slug = removerStopwords(slug);
  slug = slug.substring(0, 80);
  
  if (palavraChave) {
    const kwSlug = removerAcentos(palavraChave.toLowerCase()).replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    if (!slug.startsWith(kwSlug)) {
      slug = `${kwSlug}-${slug}`;
      slug = slug.substring(0, 80);
    }
  }
  
  return slug;
};

export const calcularScoreSlug = (slug, palavraChave = '') => {
  let score = 0;
  
  if (slug.length >= 30 && slug.length <= 60) score += 30;
  else if (slug.length < 80) score += 15;
  
  if (palavraChave && slug.includes(palavraChave.toLowerCase().replace(/\s/g, '-'))) score += 40;
  
  const hifens = (slug.match(/-/g) || []).length;
  if (hifens >= 3 && hifens <= 6) score += 20;
  
  if (!/[0-9]/.test(slug)) score += 10;
  
  return score;
};

export default function SlugGenerator({ 
  titulo, 
  slugAtual, 
  palavraChave, 
  artigoId,
  escritorioId,
  onChange 
}) {
  const [slug, setSlug] = useState(slugAtual || '');
  const [validando, setValidando] = useState(false);
  const [duplicado, setDuplicado] = useState(false);

  useEffect(() => {
    if (!slugAtual && titulo) {
      const novoSlug = gerarSlug(titulo, palavraChave);
      setSlug(novoSlug);
      onChange?.(novoSlug);
    }
  }, [titulo, palavraChave]);

  const validarUnicidade = async (slugParaValidar) => {
    if (!slugParaValidar || !escritorioId) return;
    
    setValidando(true);
    try {
      const artigos = await base44.entities.Blog.filter({
        escritorio_id: escritorioId,
        slug: slugParaValidar
      });
      
      const isDuplicado = artigos.some(a => a.id !== artigoId);
      setDuplicado(isDuplicado);
      
      if (isDuplicado) {
        const sufixo = Math.floor(Math.random() * 1000);
        const novoSlug = `${slugParaValidar}-${sufixo}`;
        setSlug(novoSlug);
        onChange?.(novoSlug);
        toast.warning('Slug duplicado! Adicionado sufixo.');
      }
    } catch (error) {
      console.error('Erro ao validar slug:', error);
    } finally {
      setValidando(false);
    }
  };

  const handleRegerar = () => {
    const novoSlug = gerarSlug(titulo, palavraChave);
    setSlug(novoSlug);
    onChange?.(novoSlug);
    validarUnicidade(novoSlug);
  };

  const handleChange = (valor) => {
    const slugLimpo = valor.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSlug(slugLimpo);
    onChange?.(slugLimpo);
  };

  const score = calcularScoreSlug(slug, palavraChave);

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Slug SEO</Label>
          <Badge variant={score >= 80 ? 'default' : score >= 60 ? 'secondary' : 'destructive'}>
            Score: {score}/100
          </Badge>
        </div>

        <div className="flex gap-2">
          <Input
            value={slug}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={() => validarUnicidade(slug)}
            placeholder="slug-amigavel-seo"
            className="font-mono text-sm"
          />
          <Button
            size="icon"
            variant="outline"
            onClick={handleRegerar}
            disabled={validando || !titulo}
            title="Regerar slug"
          >
            <RefreshCw className={`w-4 h-4 ${validando ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm">
          {duplicado ? (
            <>
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-orange-600">Slug duplicado - use outro</span>
            </>
          ) : slug ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-gray-600">Slug único e válido</span>
            </>
          ) : null}
        </div>

        {slug && (
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            URL: <span className="font-mono">/blog/{slug}</span>
          </div>
        )}
      </div>
    </Card>
  );
}