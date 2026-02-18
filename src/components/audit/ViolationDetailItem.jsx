import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Copy, ChevronDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import VerifyFileButton from './VerifyFileButton';
import ViolationHistory from './ViolationHistory';

export default function ViolationDetailItem({ violation, onResolved }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleVerified = (violationId, result) => {
    if (result.wasFixed) {
      onResolved?.(violationId);
    }
  };

  const isResolved = violation.status === 'resolved';

  const severityColors = {
    critical: 'bg-red-600',
    high: 'bg-orange-600',
    medium: 'bg-yellow-600'
  };

  const severityIcons = {
    critical: <AlertCircle className="w-4 h-4" />,
    high: <AlertCircle className="w-4 h-4" />,
    medium: <AlertCircle className="w-4 h-4" />
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Sprint de correção copiado!');
  };

  const generateSprintText = () => {
    return `## Correção: ${violation.file_name}

**Severidade:** ${violation.severity.toUpperCase()}
**Problema:** ${violation.message}

### Análise:
- Linhas Atuais: ${violation.current_lines}
- Meta: ${violation.expected_lines}
- Tipo: ${violation.file_type}
- Caminho: ${violation.file_path}

### Sprint de Correção:
\`\`\`
[ ] 1. Abrir arquivo: ${violation.file_path}
[ ] 2. Identificar seção > ${violation.current_lines} linhas
[ ] 3. Refatorar em componentes < ${violation.expected_lines} linhas
[ ] 4. Validar atomicidade (SRP)
[ ] 5. Testar isoladamente
[ ] 6. Commit: "refactor: atomize ${violation.file_name}"
\`\`\`

### Checklist Funcional:
\`\`\`
[ ] Queries retornam dados (não [])
[ ] Botões têm onClick funcional
[ ] Forms têm mutations reais
[ ] Links navegam (não #)
[ ] Loading states implementados
[ ] Error boundaries ativos
\`\`\`

### Critério de Sucesso:
- Componente < ${violation.expected_lines} linhas ✓
- Props < 5 ✓
- Testes unitários passam ✓
- Build sem warnings ✓
`;
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className={`border-l-4 ${isResolved ? 'opacity-50' : ''}`} style={{ borderLeftColor: `var(--${isResolved ? 'green' : violation.severity === 'critical' ? 'red' : violation.severity === 'high' ? 'orange' : 'yellow'}-600)` }}>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {severityIcons[violation.severity]}
                <div className="text-left flex-1">
                  <CardTitle className="text-sm font-semibold">{violation.file_name}</CardTitle>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{violation.file_path}</p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-2">{violation.message}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isResolved && (
                  <Badge className="bg-green-600 gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    RESOLVIDO
                  </Badge>
                )}
                {!isResolved && (
                  <Badge className={severityColors[violation.severity]}>
                    {violation.severity.toUpperCase()}
                  </Badge>
                )}
                <Badge variant="outline" className="font-mono text-xs">
                  {violation.current_lines}L
                </Badge>
                <ChevronDown className={`w-4 h-4 text-[var(--text-tertiary)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            <VerifyFileButton 
              violation={violation} 
              onVerified={handleVerified}
            />

            <div className="bg-[var(--bg-secondary)] rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">📋 Sprint de Correção</h4>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(generateSprintText())}
                  className="gap-2"
                >
                  <Copy className="w-3 h-3" />
                  Copiar Sprint
                </Button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Passo 1: Identificar Seção</p>
                    <p className="text-[var(--text-secondary)]">Localizar código > {violation.current_lines} linhas em {violation.file_path}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Passo 2: Refatorar Componentes</p>
                    <p className="text-[var(--text-secondary)]">Criar componentes atômicos &lt; {violation.expected_lines} linhas cada</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Passo 3: Validar SRP</p>
                    <p className="text-[var(--text-secondary)]">Single Responsibility Principle aplicado</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Passo 4: Testar Isoladamente</p>
                    <p className="text-[var(--text-secondary)]">Queries retornam dados, botões funcionam, forms têm mutations</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <h5 className="text-xs font-semibold text-orange-700 mb-2">⚠️ Problemas Detectados</h5>
                <ul className="text-xs space-y-1 text-orange-600">
                  <li>• Tamanho: {violation.current_lines} linhas (meta: ≤{violation.expected_lines})</li>
                  <li>• Atomicidade: Violada</li>
                  <li>• Complexidade: Alta</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h5 className="text-xs font-semibold text-green-700 mb-2">✅ Critérios de Sucesso</h5>
                <ul className="text-xs space-y-1 text-green-600">
                  <li>• Componente &lt; {violation.expected_lines} linhas</li>
                  <li>• Props &lt; 5</li>
                  <li>• Testes passam</li>
                  <li>• Build sem warnings</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h5 className="text-xs font-semibold text-blue-700 mb-2">💡 Sugestões de Refactoring</h5>
              <ul className="text-xs space-y-1 text-blue-600">
                <li>• Extrair lógica de negócio para hooks customizados</li>
                <li>• Separar UI em subcomponentes atômicos</li>
                <li>• Mover constantes para arquivos dedicados</li>
                <li>• Aplicar composition pattern para reutilização</li>
              </ul>
            </div>

            <ViolationHistory history={violation.history} />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}