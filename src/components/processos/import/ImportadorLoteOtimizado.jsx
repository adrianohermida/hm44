import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useImportacaoState } from './hooks/useImportacaoState';
import { DataValidator } from './parsers/dataValidator';
import JobProgressMonitor from './JobProgressMonitor';
import FileUploadZone from './FileUploadZone';
import ValidationResults from './ValidationResults';
import ImportacaoActions from './ImportacaoActions';
import AdvancedOptions from './AdvancedOptions';
import CSVTemplateDownload from './CSVTemplateDownload';
import CSVTemplateGenerator from './CSVTemplateGenerator';
import JobsQueue from './JobsQueue';
import ColumnMapper from './ColumnMapper';
import { toast } from 'sonner';

export default function ImportadorLoteOtimizado({ onClose, onSuccess }) {
  const [duplicados, setDuplicados] = useState(null);
  const [duplicateStrategy, setDuplicateStrategy] = useState('skip');
  const [mapeamentoEditavel, setMapeamentoEditavel] = useState(null);
  const [modoEdicaoMapeamento, setModoEdicaoMapeamento] = useState(false);
  const [advancedConfig, setAdvancedConfig] = useState({
    batchSize: 100,
    parallelLimit: 5,
    duplicateStrategy: 'skip',
    validateCNJ: true,
    autoLinkCliente: true,
    createMissingClientes: false
  });

  const {
    dados,
    setDados,
    validacao,
    ignorarErros,
    jobId,
    escritorio,
    setIgnorarErros,
    setJobId,
    handleDataParsed: originalHandleDataParsed,
    handleImportar,
    handleJobComplete
  } = useImportacaoState({ onSuccess, config: advancedConfig });

  const handleDataParsed = async (parseResult) => {
    await originalHandleDataParsed(parseResult);
    setMapeamentoEditavel(parseResult.mapeamento || {});
    
    // Detectar duplicados
    if (parseResult.dados?.length > 0 && escritorio?.id) {
      const duplicadosResult = await DataValidator.detectarDuplicados(
        parseResult.dados,
        base44,
        escritorio.id
      );
      setDuplicados(duplicadosResult);
    }
  };

  const handleAplicarMapeamento = async () => {
    if (!mapeamentoEditavel || Object.keys(mapeamentoEditavel).length === 0) {
      toast.error('Mapeamento inválido');
      return;
    }

    const dadosRemapeados = dados.map(row => {
      const novo = { _linha: row._linha };
      Object.entries(mapeamentoEditavel).forEach(([headerOriginal, campoSchema]) => {
        if (campoSchema && campoSchema !== '__ignorar__' && row[headerOriginal]) {
          novo[campoSchema] = row[headerOriginal];
        }
      });
      return novo;
    });
    
    setDados(dadosRemapeados);
    setModoEdicaoMapeamento(false);
    
    await originalHandleDataParsed({
      dados: dadosRemapeados,
      mapeamento: mapeamentoEditavel,
      modelo: 'remapeado',
      headers: Object.keys(mapeamentoEditavel)
    });
    
    toast.success('Mapeamento aplicado e dados revalidados');
  };

  const handleConfirmarImport = async () => {
    if (!dados || dados.length === 0) {
      toast.error('Nenhum dado para importar');
      return;
    }

    if (!escritorio?.id) {
      toast.error('Escritório não encontrado');
      return;
    }

    if (validacao?.erros?.length > 0 && !ignorarErros) {
      toast.error('Corrija os erros antes de importar ou marque "Ignorar erros"');
      return;
    }

    await handleImportar();
  };

  const handleResetImport = () => {
    setJobId(null);
  };

  if (jobId) {
    return (
      <div className="space-y-4">
        <JobProgressMonitor 
          jobId={jobId} 
          onComplete={handleJobComplete} 
          onError={handleResetImport} 
        />
        <Button 
          variant="ghost" 
          onClick={handleResetImport}
          className="w-full"
        >
          Voltar para importação
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4">
      <div className="lg:col-span-2 space-y-6">
        {!escritorio?.id && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-semibold">Escritório não encontrado</span>
          </div>
        )}

        {!dados.length ? (
          <>
            <div className="flex justify-end">
              <CSVTemplateGenerator />
            </div>
            <FileUploadZone onDataParsed={handleDataParsed} disabled={!escritorio?.id} />
          </>
        ) : (
          <>
            {modoEdicaoMapeamento ? (
              <>
                <ColumnMapper
                  headers={validacao?.headers || Object.keys(dados[0] || {}).filter(k => k !== '_linha')}
                  mapeamento={mapeamentoEditavel || {}}
                  onChange={setMapeamentoEditavel}
                  primeiraLinha={dados[0]}
                />
                <div className="flex gap-2">
                  <Button onClick={handleAplicarMapeamento} className="flex-1">
                    Aplicar Mapeamento
                  </Button>
                  <Button variant="outline" onClick={() => setModoEdicaoMapeamento(false)}>
                    Cancelar
                  </Button>
                </div>
              </>
            ) : (
              <>
                <ValidationResults 
                  validacao={validacao}
                  duplicados={duplicados}
                  duplicateStrategy={duplicateStrategy}
                  dados={dados}
                  onDuplicateStrategyChange={(strategy) => {
                    setDuplicateStrategy(strategy);
                    setAdvancedConfig({ ...advancedConfig, duplicateStrategy: strategy });
                  }}
                />
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setModoEdicaoMapeamento(true)}
                  className="mb-4"
                >
                  Editar Mapeamento de Colunas
                </Button>
            
            <AdvancedOptions
              config={advancedConfig}
              onChange={setAdvancedConfig}
              totalRecords={dados.length}
            />

            <ImportacaoActions
              validacao={validacao}
              ignorarErros={ignorarErros}
              onIgnorarChange={setIgnorarErros}
              onImportar={handleConfirmarImport}
              onCancelar={onClose}
              totalRecords={dados.length}
              batchSize={advancedConfig.batchSize}
            />
              </>
            )}
          </>
        )}
      </div>
      
      <div className="lg:col-span-1">
        <JobsQueue 
          escritorioId={escritorio?.id}
          onJobClick={(job) => setJobId(job.id)}
        />
      </div>
    </div>
  );
}