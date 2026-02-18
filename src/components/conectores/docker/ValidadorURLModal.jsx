import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { CheckCircle, XCircle, AlertTriangle, Loader2, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ValidadorURLModal({ url: urlProp, open, onClose, onUrlValidada }) {
  const [url, setUrl] = useState(urlProp || '');
  const [validando, setValidando] = useState(false);
  const [resultado, setResultado] = useState(null);

  React.useEffect(() => {
    if (urlProp) {
      setUrl(urlProp);
      // Auto-validar se URL foi passada como prop
      if (open && urlProp) {
        validarURL(urlProp);
      }
    }
  }, [urlProp, open]);

  const validarURL = async (urlToValidate) => {
    const urlFinal = urlToValidate || url;
    if (!urlFinal.trim()) {
      setResultado({
        valido: false,
        erro: 'URL é obrigatória'
      });
      return;
    }
    
    setValidando(true);
    setResultado(null);
    
    try {
      console.log('Validando URL:', urlFinal);
      
      const result = await base44.functions.invoke('validarURLDocumentacao', { url: urlFinal.trim() });
      
      console.log('Resultado validação:', result);
      
      if (result.data) {
        setResultado(result.data);
      } else {
        throw new Error('Resposta de validação inválida');
      }
    } catch (error) {
      console.error('Erro na validação:', error);
      setResultado({
        valido: false,
        erro: error.message || 'Erro ao validar URL'
      });
    } finally {
      setValidando(false);
    }
  };

  const prosseguir = () => {
    if (resultado?.valido) {
      console.log('Prosseguindo com análise:', resultado);
      onUrlValidada({
        url: resultado.url,
        tipo_fonte: resultado.tipo_detectado,
        confianca: resultado.confianca
      });
      setUrl('');
      setResultado(null);
      onClose();
    }
  };
  
  const handleClose = () => {
    setUrl('');
    setResultado(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Validar URL de Documentação</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="https://api.exemplo.com/docs"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !validando && url && validarURL()}
              disabled={validando}
            />
            <Button onClick={() => validarURL()} disabled={validando || !url}>
              {validando ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Validar'}
            </Button>
          </div>

          {resultado && (
            <div className={`border rounded-lg p-4 ${
              resultado.valido 
                ? 'bg-green-50 border-green-200 dark:bg-green-950/20' 
                : 'bg-red-50 border-red-200 dark:bg-red-950/20'
            }`}>
              <div className="flex items-start gap-3 mb-3">
                {resultado.valido ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">
                    {resultado.valido ? 'URL Válida' : 'URL Inválida'}
                  </h4>
                  {resultado.erro && (
                    <p className="text-xs text-red-700 dark:text-red-400">{resultado.erro}</p>
                  )}
                </div>
              </div>

              {resultado.valido && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[var(--text-tertiary)]">Tipo:</span>
                      <Badge className="ml-2">{resultado.tipo_detectado}</Badge>
                    </div>
                    <div>
                      <span className="text-[var(--text-tertiary)]">Confiança:</span>
                      <Badge variant={resultado.confianca >= 0.7 ? "default" : "secondary"} className="ml-2">
                        {Math.round(resultado.confianca * 100)}%
                      </Badge>
                    </div>
                  </div>

                  {resultado.content_type && (
                    <div className="text-xs">
                      <span className="text-[var(--text-tertiary)]">Content-Type:</span>
                      <code className="ml-2 bg-[var(--bg-tertiary)] px-2 py-0.5 rounded">
                        {resultado.content_type}
                      </code>
                    </div>
                  )}

                  {resultado.avisos?.length > 0 && (
                    <div className="space-y-1 mt-3">
                      {resultado.avisos.map((aviso, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-yellow-700 dark:text-yellow-400">
                          <AlertTriangle className="w-3 h-3" />
                          {aviso}
                        </div>
                      ))}
                    </div>
                  )}

                  {resultado.recomendacao && (
                    <p className="text-xs text-green-700 dark:text-green-400 mt-2">
                      ✓ {resultado.recomendacao}
                    </p>
                  )}
                </div>
              )}

              {resultado.detalhes && (
                <p className="text-xs text-[var(--text-tertiary)] mt-2">{resultado.detalhes}</p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>Cancelar</Button>
            {resultado?.valido && (
              <Button onClick={prosseguir} className="bg-[var(--brand-primary)]">
                <ExternalLink className="w-4 h-4 mr-2" />
                Prosseguir com Análise
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}