import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function PreviewModal({ open, onClose, artigo }) {
  if (!artigo) return null;

  const montarConteudo = () => {
    let markdown = '';
    artigo.topicos?.forEach(topico => {
      if (topico.tipo === 'h1') markdown += `# ${topico.texto}\n\n`;
      else if (topico.tipo === 'h2') markdown += `## ${topico.texto}\n\n`;
      else if (topico.tipo === 'h3') markdown += `### ${topico.texto}\n\n`;
      else if (topico.tipo === 'h4') markdown += `#### ${topico.texto}\n\n`;
      else if (topico.tipo === 'h5') markdown += `##### ${topico.texto}\n\n`;
      else if (topico.tipo === 'paragrafo') markdown += `${topico.texto}\n\n`;
      else if (topico.tipo === 'lista') {
        topico.itens?.forEach(item => markdown += `- ${item}\n`);
        markdown += '\n';
      }
    });

    if (artigo.disclaimer_ativo && artigo.disclaimer_texto) {
      markdown += `\n---\n\n**${artigo.disclaimer_texto}**\n`;
    }

    return markdown;
  };

  const baseUrl = 'https://hermidamaia.adv.br';
  const urlPublica = artigo.slug 
    ? `${baseUrl}/blog/${artigo.slug}` 
    : artigo.id 
    ? `${baseUrl}/BlogPost?id=${artigo.id}` 
    : `${baseUrl}/Blog`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Preview do Artigo</DialogTitle>
            <div className="flex items-center gap-2">
              {artigo.id && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(urlPublica, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Abrir Público
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <article className="prose prose-gray max-w-none p-6">
            {artigo.imagem_capa && (
              <img 
                src={artigo.imagem_capa} 
                alt={artigo.imagem_alt || artigo.titulo} 
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}

            <div className="mb-4">
              <h1 className="text-3xl font-bold mb-2">{artigo.titulo}</h1>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                {artigo.autor && <span>Por {artigo.autor}</span>}
                {artigo.categoria && (
                  <Badge variant="outline">{artigo.categoria.replace(/_/g, ' ')}</Badge>
                )}
              </div>

              {artigo.resumo && (
                <p className="text-lg text-gray-700 mb-6">{artigo.resumo}</p>
              )}
            </div>

            <ReactMarkdown
              components={{
                h1: ({children}) => <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>,
                h2: ({children}) => <h2 className="text-xl font-bold mt-6 mb-3">{children}</h2>,
                h3: ({children}) => <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>,
                h4: ({children}) => <h4 className="text-base font-semibold mt-3 mb-2">{children}</h4>,
                h5: ({children}) => <h5 className="text-sm font-semibold mt-2 mb-1">{children}</h5>,
                p: ({children}) => <p className="mb-4 leading-relaxed">{children}</p>,
                ul: ({children}) => <ul className="mb-4 ml-6 list-disc">{children}</ul>,
                ol: ({children}) => <ol className="mb-4 ml-6 list-decimal">{children}</ol>,
                li: ({children}) => <li className="mb-2">{children}</li>,
                a: ({children, href}) => (
                  <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                img: ({src, alt}) => (
                  <img src={src} alt={alt} className="w-full h-auto rounded-lg my-4" />
                ),
                blockquote: ({children}) => (
                  <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>
                ),
                code: ({inline, children}) => 
                  inline ? (
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{children}</code>
                  ) : (
                    <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto my-4">
                      <code>{children}</code>
                    </pre>
                  )
              }}
            >
              {montarConteudo()}
            </ReactMarkdown>

            {artigo.keywords?.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <p className="text-sm font-semibold text-gray-700 mb-2">Palavras-chave:</p>
                <div className="flex flex-wrap gap-2">
                  {artigo.keywords.map((kw, i) => (
                    <Badge key={i} variant="outline">{kw}</Badge>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>

        {artigo.id && (
          <div className="flex-shrink-0 p-4 bg-gray-50 border-t">
            <p className="text-xs text-gray-600 mb-1">URL Pública:</p>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={urlPublica}
                readOnly
                className="flex-1 text-sm bg-white border rounded px-3 py-1.5"
              />
              <Button
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(urlPublica);
                  alert('URL copiada!');
                }}
              >
                Copiar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}