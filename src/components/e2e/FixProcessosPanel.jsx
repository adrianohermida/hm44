import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { base44 } from '@/api/base44Client';
import { Loader2, Search, Play, CheckCircle } from 'lucide-react';

export default function FixProcessosPanel() {
  const [scanning, setScanning] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [batchSize, setBatchSize] = useState(50);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fixStats, setFixStats] = useState({ total: 0, erros: [] });

  const runScan = async () => {
    setScanning(true);
    setScanResult(null);
    try {
      const { data } = await base44.functions.invoke('runE2ETest', {
        testName: 'fix_processos_escritorio',
        action: 'scan'
      });
      setScanResult(data.details);
      setCurrentIndex(0);
      setFixStats({ total: 0, erros: [] });
    } catch (error) {
      console.error(error);
    }
    setScanning(false);
  };

  const runFixBatch = async () => {
    setFixing(true);
    try {
      const { data } = await base44.functions.invoke('runE2ETest', {
        testName: 'fix_processos_escritorio',
        action: 'fix',
        batchSize,
        startIndex: currentIndex
      });
      
      setFixStats(prev => ({
        total: prev.total + data.details.corrigidos,
        erros: [...prev.erros, ...data.details.erros]
      }));
      
      setCurrentIndex(data.details.proximo_index);
    } catch (error) {
      console.error(error);
    }
    setFixing(false);
  };

  const totalProblemas = scanResult?.com_problemas || 0;
  const progress = totalProblemas > 0 ? (currentIndex / totalProblemas) * 100 : 0;
  const remaining = Math.max(0, totalProblemas - currentIndex);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔧 Corrigir Processos - Escritório
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={runScan} disabled={scanning || fixing}>
            {scanning ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            {scanning ? 'Escaneando...' : 'Escanear Processos'}
          </Button>
        </div>

        {scanResult && (
          <div className="space-y-4 p-4 bg-[var(--bg-tertiary)] rounded-lg">
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-[var(--text-tertiary)]">Total</div>
                <div className="font-bold text-lg">{scanResult.total}</div>
              </div>
              <div>
                <div className="text-[var(--text-tertiary)]">Corretos</div>
                <div className="font-bold text-lg text-green-600">{scanResult.corretos}</div>
              </div>
              <div>
                <div className="text-[var(--text-tertiary)]">Com Problemas</div>
                <div className="font-bold text-lg text-orange-600">{scanResult.com_problemas}</div>
              </div>
            </div>

            {scanResult.com_problemas > 0 && (
              <>
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={batchSize}
                      onChange={(e) => setBatchSize(Number(e.target.value))}
                      min={1}
                      max={100}
                      className="w-24"
                    />
                    <span className="text-sm text-[var(--text-secondary)]">
                      processos por lote
                    </span>
                  </div>

                  <Progress value={progress} className="h-2" />

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">
                      Processados: {currentIndex} / {totalProblemas}
                    </span>
                    <span className="font-medium text-orange-600">
                      Faltam: {remaining}
                    </span>
                  </div>

                  <Button
                    onClick={runFixBatch}
                    disabled={fixing || remaining === 0}
                    className="w-full"
                  >
                    {fixing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : remaining === 0 ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    {fixing ? `Processando lote...` : remaining === 0 ? 'Concluído!' : `Processar ${Math.min(batchSize, remaining)} processos`}
                  </Button>

                  {fixStats.total > 0 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="font-medium text-green-800">
                        ✅ {fixStats.total} processos corrigidos
                      </div>
                      {fixStats.erros.length > 0 && (
                        <div className="mt-2 text-sm text-red-600">
                          ⚠️ {fixStats.erros.length} erros
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}