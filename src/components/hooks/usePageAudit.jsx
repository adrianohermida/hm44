import { useMemo } from 'react';

export default function usePageAudit(componentData) {
  return useMemo(() => {
    const checks = {
      atomicidade: [],
      seguranca: [],
      performance: [],
      acessibilidade: [],
      lgpd: []
    };

    if (componentData.lineCount > 50 && componentData.type === 'component') {
      checks.atomicidade.push({
        status: 'fail',
        label: `${componentData.name}: ${componentData.lineCount} linhas`,
        details: 'Limite: 50 linhas - quebrar em componentes menores'
      });
    }

    if (componentData.lineCount > 100 && componentData.type === 'page') {
      checks.atomicidade.push({
        status: 'fail',
        label: `${componentData.name}: ${componentData.lineCount} linhas`,
        details: 'Limite: 100 linhas para orquestrador'
      });
    }

    if (!componentData.hasEscritorioFilter) {
      checks.seguranca.push({
        status: 'fail',
        label: 'Queries sem escritorio_id',
        details: 'Multi-tenant obrigatório - vazamento crítico'
      });
    }

    if (!componentData.hasPermissionCheck && componentData.hasClienteMode) {
      checks.seguranca.push({
        status: 'fail',
        label: 'Permissões cliente ausentes',
        details: 'Modo cliente sem verificação de acesso'
      });
    }

    if (!componentData.hasAuditLog) {
      checks.lgpd.push({
        status: 'fail',
        label: 'Auditoria de acesso ausente',
        details: 'LGPD: registrar quem acessou o quê'
      });
    }

    const totalItems = Object.values(checks).flat().length;
    const passed = Object.values(checks).flat().filter(i => i.status === 'pass').length;
    const score = totalItems ? ((passed / totalItems) * 100).toFixed(0) : 100;

    return { checks, score, totalItems };
  }, [componentData]);
}