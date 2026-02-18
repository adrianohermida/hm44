import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle2, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function BuscaPorCNJ({ onResultados }) {
  const [cnj, setCnj] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificacao, setVerificacao] = useState(null);

  const buscar = async (forcarBusca = false) => {
    if (!cnj) return toast.error('Informe o número CNJ');
    
    const cnjLimpo = cnj.replace(/\D/g, '');
    if (cnjLimpo.length < 20) {
      return toast.error('CNJ inválido - deve ter 20 dígitos');
    }
    
    setLoading(true);
    setVerificacao(null);
    
    try {
      const { data } = await base44.functions.invoke('buscarProcessoPorCNJ', { 
        numero_cnj: cnjLimpo,
        forcar_busca: forcarBusca
      });

      // Processo já existe na base
      if (data.processo_existente && !forcarBusca) {
        setVerificacao(data);
        
        if (data.dados_completos) {
          toast.info('Processo já existe com dados completos');
        } else {
          toast.warning('Processo existe mas está incompleto');
        }
        return;
      }

      // Processo criado/atualizado com sucesso
      if (data.processo_criado || data.sucesso) {
        toast.success(
          `✅ Processo salvo! ${data.partes_salvas || 0} partes, ${data.fontes_salvas || 0} fontes`
        );
        
        // Mapear dados completos para exibição
        onResultados({ 
          processos: [{
            numero_cnj: data.processo?.numero_cnj || cnjLimpo,
            titulo: data.processo?.titulo,
            tribunal: data.processo?.tribunal,
            classe: data.processo?.classe,
            assunto: data.processo?.assunto,
            status: data.processo?.status,
            polo_ativo: data.processo?.polo_ativo,
            polo_passivo: data.processo?.polo_passivo,
            salvo: true
          }],
          processo_salvo: true,
          processos_salvos: 1
        });
        setVerificacao(null);
        setCnj('');
      }
    } catch (err) {
      toast.error(err.message || 'Erro na busca');
      setVerificacao(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEnriquecer = () => {
    buscar(true);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input 
          placeholder="0000000-00.0000.0.00.0000"
          value={cnj}
          onChange={(e) => setCnj(e.target.value)}
          disabled={loading}
        />
        <Button onClick={() => buscar(false)} disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </Button>
      </div>

      {verificacao && (
        <Alert className={verificacao.dados_completos ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
          <div className="flex items-start gap-3">
            {verificacao.dados_completos ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="font-medium text-sm mb-2">
                {verificacao.mensagem}
              </div>
              
              <div className="space-y-1 text-xs text-[var(--text-secondary)]">
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">{verificacao.processo?.numero_cnj}</Badge>
                  <Badge variant="outline">{verificacao.processo?.tribunal}</Badge>
                  <Badge variant="outline">{verificacao.partes?.length || 0} partes</Badge>
                  <Badge variant="outline">{verificacao.fontes?.length || 0} fontes</Badge>
                </div>
                
                {verificacao.processo?.titulo && (
                  <div className="mt-1">{verificacao.processo.titulo}</div>
                )}
              </div>

              {!verificacao.dados_completos && (
                <Button 
                  onClick={handleEnriquecer}
                  size="sm"
                  className="mt-3"
                  disabled={loading}
                >
                  <Download className="w-3 h-3 mr-2" />
                  {loading ? 'Enriquecendo...' : 'Enriquecer com API (1 crédito)'}
                </Button>
              )}
            </div>
          </div>
        </Alert>
      )}
    </div>
  );
}