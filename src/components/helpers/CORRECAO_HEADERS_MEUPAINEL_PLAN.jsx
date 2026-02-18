# 🔧 CORREÇÃO IMEDIATA: HEADERS MEUPAINEL

**Prioridade:** 🔴 ALTA (Débito técnico visual)  
**Tempo:** 2 horas  
**Páginas afetadas:** 5

---

## 📸 PROBLEMAS IDENTIFICADOS (dos prints)

### 1. MeusProcessos
- ❌ Header genérico sem context
- ❌ Falta breadcrumb
- ❌ Título sozinho sem estrutura
- ✅ Status badge ("SINCRONIZADO") está bom

### 2. MinhasConsultas
- ❌ Sem breadcrumb
- ❌ Header minimalista
- ✅ Título ok

### 3. MinhasFaturas
- ❌ Sem breadcrumb
- ❌ Falta ícone de segurança ("PAGAMENTO SEGURO")
- ❌ Estrutura desalinhada

### 4. MeusDocumentos
- ❌ Layout em cards, mas cabeçalho inconsistente
- ❌ Sem breadcrumb central

### 5. MeuPlanoPagamento
- ❌ Sem breadcrumb
- ❌ Status ("EM REVISÃO") desalinhado
- ❌ Header frágil

---

## ✅ SOLUÇÃO: Novo Componente ModuleHeader.jsx

```jsx
// ModuleHeader.jsx (38 linhas)
import { ChevronRight, Shield, CheckCircle2 } from 'lucide-react';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { Badge } from '@/components/ui/badge';

export default function ModuleHeader({
  title,
  breadcrumbItems,
  statusBadge,
  icon: Icon,
  action
}) {
  return (
    <div className="bg-[var(--bg-primary)] border-b border-[var(--border-primary)] p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        {breadcrumbItems && <Breadcrumb items={breadcrumbItems} />}
        
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {Icon && <Icon className="w-6 h-6 text-[var(--brand-primary)]" />}
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              {title}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {statusBadge && (
              <Badge className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                {statusBadge}
              </Badge>
            )}
            {action}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 📝 APLICAÇÃO EM CADA PÁGINA

### MeusProcessos
```jsx
<ModuleHeader
  title="Meus Processos"
  breadcrumbItems={[
    { label: 'Painel', url: createPageUrl('MeuPainel') },
    { label: 'Processos' }
  ]}
  statusBadge="SINCRONIZADO"
  icon={FileText}
  action={<SyncBadge />}
/>
```

### MinhasConsultas
```jsx
<ModuleHeader
  title="Minhas Consultas"
  breadcrumbItems={[
    { label: 'Painel', url: createPageUrl('MeuPainel') },
    { label: 'Consultas' }
  ]}
  icon={Calendar}
/>
```

### MinhasFaturas
```jsx
<ModuleHeader
  title="Minhas Faturas"
  breadcrumbItems={[
    { label: 'Painel', url: createPageUrl('MeuPainel') },
    { label: 'Faturas' }
  ]}
  statusBadge="PAGAMENTO SEGURO"
  icon={CreditCard}
  action={<ShieldBadge />}
/>
```

### MeusDocumentos
```jsx
<ModuleHeader
  title="Meus Documentos"
  breadcrumbItems={[
    { label: 'Painel', url: createPageUrl('MeuPainel') },
    { label: 'Documentos' }
  ]}
  icon={FileText}
/>
```

### MeuPlanoPagamento
```jsx
<ModuleHeader
  title="Plano de Pagamento"
  breadcrumbItems={[
    { label: 'Painel', url: createPageUrl('MeuPainel') },
    { label: 'Plano' }
  ]}
  statusBadge="EM REVISÃO"
  icon={DollarSign}
/>
```

---

## 🎯 RESULTADO ESPERADO

| Item | Antes | Depois |
|------|-------|--------|
| Breadcrumb | ❌ Falta | ✅ Todos têm |
| Ícone | ❌ Inconsistente | ✅ Padrão |
| Status badge | ❌ Desalinhado | ✅ Alinhado direita |
| Espaçamento | ❌ Irregular | ✅ Consistente |
| Visual score | 70% | 95%+ |

---

**Execução:** IMEDIATO (antes de Sprint A1 formal)