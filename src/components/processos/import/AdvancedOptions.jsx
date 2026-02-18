import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChevronDown, Settings } from 'lucide-react';
import BatchSizeSelector from './BatchSizeSelector';
import DuplicateStrategy from './DuplicateStrategy';

export default function AdvancedOptions({ config, onChange, totalRecords }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Opções Avançadas
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            <BatchSizeSelector
              value={config.batchSize}
              onChange={(v) => onChange({ ...config, batchSize: v })}
              totalRecords={totalRecords}
            />

            <DuplicateStrategy
              value={config.duplicateStrategy}
              onChange={(v) => onChange({ ...config, duplicateStrategy: v })}
            />

            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Validar CNJ</Label>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Valida formato do número CNJ antes de importar
                  </p>
                </div>
                <Switch
                  checked={config.validateCNJ}
                  onCheckedChange={(v) => onChange({ ...config, validateCNJ: v })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-vincular cliente</Label>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Busca cliente por CPF/CNPJ automaticamente
                  </p>
                </div>
                <Switch
                  checked={config.autoLinkCliente}
                  onCheckedChange={(v) => onChange({ ...config, autoLinkCliente: v })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Criar clientes faltantes</Label>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Cria cliente automaticamente se não existir
                  </p>
                </div>
                <Switch
                  checked={config.createMissingClientes}
                  onCheckedChange={(v) => onChange({ ...config, createMissingClientes: v })}
                  disabled={!config.autoLinkCliente}
                />
              </div>

              <div className="space-y-2">
                <Label>Paralelismo (processos simultâneos)</Label>
                <select
                  value={config.parallelLimit || 5}
                  onChange={(e) => onChange({ ...config, parallelLimit: parseInt(e.target.value) })}
                  className="w-full rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2 text-sm"
                >
                  <option value="1">1 - Sequencial</option>
                  <option value="3">3 - Moderado</option>
                  <option value="5">5 - Rápido ⚡</option>
                  <option value="10">10 - Turbo</option>
                </select>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Maior = mais rápido, mas pode gerar rate limit
                </p>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}