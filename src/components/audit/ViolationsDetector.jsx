import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, XCircle, Copy, Download, Eye, EyeOff } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ViolationDetailItem from './ViolationDetailItem';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function ViolationsDetector({ escritorioId, onScanComplete }) {
  const [showResolved, setShowResolved] = React.useState(false);
  const queryClient = useQueryClient();

  const { data: violations = [], isLoading } = useQuery({
    queryKey: ['auditoria-violacoes', escritorioId],
    queryFn: async () => {
      if (!escritorioId) return [];
      const viols = await base44.entities.AuditoriaViolacao.filter({
        escritorio_id: escritorioId
      }, '-severity', 100);
      return viols;
    },
    enabled: !!escritorioId
  });

  const handleViolationResolved = (violationId) => {
    queryClient.invalidateQueries(['auditoria-violacoes']);
    toast.success('Violação atualizada!');
  };

  const visibleViolations = showResolved 
    ? violations 
    : violations.filter(v => v.status !== 'resolved');

  const criticalCount = visibleViolations.filter(v => v.severity === 'critical' && v.status !== 'resolved').length;
  const highCount = visibleViolations.filter(v => v.severity === 'high' && v.status !== 'resolved').length;
  const mediumCount = visibleViolations.filter(v => v.severity === 'medium' && v.status !== 'resolved').length;
  const resolvedCount = violations.filter(v => v.status === 'resolved').length;

  const exportFullSprint = () => {
    const activeViolations = violations.filter(v => v.status !== 'resolved');
    const sprintText = activeViolations.map((v, i) => {
      return `## 🎯 Correção ${i + 1}/${activeViolations.length}: ${v.file_name}

**Severidade:** ${v.severity.toUpperCase()}
**Tipo:** ${v.file_type}
**Caminho:** ${v.file_path}
**Problema:** ${v.message}

### Sprint de Correção:
- [ ] Abrir arquivo: ${v.file_path}
- [ ] Identificar seção > ${v.current_lines} linhas
- [ ] Refatorar em componentes < 50 linhas
- [ ] Validar atomicidade (SRP)
- [ ] Testar isoladamente
- [ ] Commit: "refactor: atomize ${v.file_name}"

### Checklist Funcional:
- [ ] Queries retornam dados (não [])
- [ ] Botões têm onClick funcional
- [ ] Forms têm mutations reais
- [ ] Links navegam (não #)
- [ ] Loading states implementados
- [ ] Error boundaries ativos

---
`;
    }).join('\n\n');

    const blob = new Blob([sprintText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sprint-auditoria-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Sprint completo baixado!');
  };

  const copyAllSprints = () => {
    const activeViolations = violations.filter(v => v.status !== 'resolved');
    const sprintText = activeViolations.map((v, i) => {
      return `${i + 1}. ${v.file_name} (${v.severity}) - ${v.current_lines}L\n   Sprint: Refatorar ${v.file_path} < ${v.expected_lines}L`;
    }).join('\n\n');
    
    navigator.clipboard.writeText(sprintText);
    toast.success(`${activeViolations.length} sprints copiados!`);
  };

  return (
    <Card className={violations.length > 0 ? 'border-red-200' : 'border-green-200'}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {violations.length > 0 ? (
              <XCircle className="w-5 h-5 text-red-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-green-600" />
            )}
            <CardTitle>Violações Detectadas - Sprint Detalhado</CardTitle>
          </div>
          {violations.length > 0 && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowResolved(!showResolved)}
              >
                {showResolved ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showResolved ? 'Ocultar' : 'Mostrar'} Resolvidas
              </Button>
              <Button variant="outline" size="sm" onClick={copyAllSprints}>
                <Copy className="w-4 h-4 mr-2" />
                Copiar Resumo
              </Button>
              <Button variant="outline" size="sm" onClick={exportFullSprint}>
                <Download className="w-4 h-4 mr-2" />
                Baixar Sprint
              </Button>
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-2">
          <Badge className={criticalCount > 0 ? 'bg-red-600' : 'bg-gray-400'}>
            {criticalCount} Críticas
          </Badge>
          <Badge className={highCount > 0 ? 'bg-orange-600' : 'bg-gray-400'}>
            {highCount} Altas
          </Badge>
          <Badge className={mediumCount > 0 ? 'bg-yellow-600' : 'bg-gray-400'}>
            {mediumCount} Médias
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-[var(--text-secondary)]">Carregando violações...</p>
          </div>
        ) : violations.length === 0 ? (
          <div className="text-center py-8 text-green-600">
            ✅ Nenhuma violação detectada! Execute o scan primeiro.
          </div>
        ) : visibleViolations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-green-600 font-semibold mb-2">
              ✅ Todas as violações foram resolvidas!
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowResolved(true)}
            >
              Ver {resolvedCount} violações resolvidas
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {visibleViolations.map((v) => (
                <ViolationDetailItem 
                  key={v.id}
                  violation={v} 
                  onResolved={handleViolationResolved}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}