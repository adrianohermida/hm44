import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Link2, Check, AlertCircle } from 'lucide-react';

export default function CanonicalUrlManager({ 
  slug, 
  urlCanonica, 
  onChange,
  dominio = 'https://hermidamaia.adv.br'
}) {
  const [url, setUrl] = useState(urlCanonica || '');
  const [valida, setValida] = useState(true);

  useEffect(() => {
    if (slug && !urlCanonica) {
      const novaUrl = `${dominio}/blog/${slug}`;
      setUrl(novaUrl);
      onChange?.(novaUrl);
    }
  }, [slug]);

  const validarUrl = (urlParaValidar) => {
    try {
      new URL(urlParaValidar);
      setValida(true);
      return true;
    } catch {
      setValida(false);
      return false;
    }
  };

  const handleChange = (valor) => {
    setUrl(valor);
    if (validarUrl(valor)) {
      onChange?.(valor);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            URL Canônica
          </Label>
          {valida ? (
            <Badge variant="default">
              <Check className="w-3 h-3 mr-1" />
              Válida
            </Badge>
          ) : (
            <Badge variant="destructive">
              <AlertCircle className="w-3 h-3 mr-1" />
              Inválida
            </Badge>
          )}
        </div>

        <Input
          value={url}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="https://hermidamaia.adv.br/blog/seu-slug"
          className="font-mono text-sm"
        />

        <div className="text-xs text-gray-500 space-y-1">
          <p>✓ Define a URL preferencial para indexação</p>
          <p>✓ Evita conteúdo duplicado no Google</p>
          <p>✓ Tag &lt;link rel="canonical"&gt; inserida automaticamente</p>
        </div>
      </div>
    </Card>
  );
}