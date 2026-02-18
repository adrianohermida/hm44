# 📋 PLANO INCREMENTAL: ESTANTE DIGITAL + SOLICITAÇÃO CÓPIA ELETRÔNICA

**Data:** 2026-02-18  
**Status:** ⏳ Aprovação de Plano  
**Estimativa Total:** 4 Sprints (16 dias)

---

## 🎯 OBJETIVOS FINAIS

```
✅ Correção design headers (MeuPainel modules)
✅ Banner persistente em Processos → "Solicitar Cópia Eletrônica"
✅ Dashboard Admin bidirecional (receber/validar/entregar solicitações)
✅ PDF Viewer + Download (30 dias de disponibilidade)
✅ Estante Digital (Flipbook com contratação anual)
✅ Upgrade monitoramento Escavador integrado
```

---

## 📊 PLANO INCREMENTAL (4 SPRINTS)

### **SPRINT A1: Design Headers + Estrutura (2 dias)**

#### **Fase A1.1: Correção Headers (6 horas)**

**Problema identificado nos prints:**
- Headers sem breadcrumb consistente
- Título sem contexto/ícone
- Falta de estrutura visual unificada

**Deliverables:**
1. Novo componente `ModuleHeader.jsx` (< 40 linhas)
```jsx
// ModuleHeader.jsx
// Props: title, breadcrumb, action?, icon?
// Renderiza: Breadcrumb + Title + Action Button (opcional)
// CSS: Consistent padding, border-bottom, bg-var(--bg-primary)
```

2. Refatorar 5 páginas:
   - MeusProcessos
   - MinhasConsultas
   - MinhasFaturas
   - MeusDocumentos
   - MeuPlanoPagamento

**Score Esperado:** 100% visual consistency

---

#### **Fase A1.2: Estrutura Entities (4 horas)**

**Criar 3 entities:**

```
1. SolicitacaoCopiaEletronicaCliente
   - processo_id (FK)
   - cliente_email
   - status: "pendente_pagamento" | "pagamento_confirmado" | "processando" | "entregue" | "expirado"
   - data_expiracao (30 dias a partir de entrega)
   - pdf_url (arquivo gerado)
   - valor: 39.90
   - stripe_payment_id

2. SolicitacaoCopiaEletronicaAdmin
   - solicitacao_cliente_id (FK)
   - admin_email
   - data_aceitacao
   - data_processamento
   - tipo_documento: "copia_integra" | "copia_resumida"
   - notas_processamento
   - arquivo_gerado_url
   - status_validacao: "pendente" | "aceito" | "rejeitado"

3. AssinanteFliBook
   - cliente_email
   - data_inicio_assinatura
   - data_proxima_renovacao
   - status: "ativo" | "expirado" | "cancelado"
   - plano: "anual_parcelado_12x" | "anual_avista"
   - valor_total: 297.00 ou 29.90 * 12
   - stripe_subscription_id
   - arquivos_flipbook: [] // URL dos PDFs organizados
```

**Score Esperado:** Schema 100% funcional

---

### **SPRINT A2: Banner + Request System Cliente (3 dias)**

#### **Fase A2.1: Banner Persistente (3 horas)**

**Novo componente: `ProcessoSolicitacaoCopiaEletronicaBanner.jsx`**

```jsx
// Props:
// - processo: Processo
// - cliente_email: string
// - onSuccess: callback

// Layout:
// [Ícone] "Solicitar Cópia Eletrônica" | "R$ 39,90 por solicitação" [Solicitar] [Detalhes]

// Comportamento:
// 1. Click "Solicitar" → Modal com termos (LGPD + termos de uso)
// 2. Aceitar termos → Ir para checkout Stripe
// 3. Pagamento confirmado → Criar SolicitacaoCopiaEletronicaCliente
// 4. Toast sucesso + evento para Admin Dashboard
```

**Modificar: ProcessoDetails.jsx**
- Adicionar banner no topo ou rodapé (sticky)
- Renderizar condicional se processo não tiver cópia pendente

**Score Esperado:** Banner 100% funcional

---

#### **Fase A2.2: Modal + Checkout (4 horas)**

**Novo componente: `ModalSolicitacaoCopia.jsx`**
```
Passo 1: Termos LGPD + Serviço (read-only com accept checkbox)
Passo 2: Revisar dados (cliente_email, processo_id, valor)
Passo 3: Checkout Stripe (usar suggest_stripe_installation se não configurado)
Passo 4: Confirmação (receipt + aguardando processamento)
```

**Backend function: `criarSolicitacaoCopia.js`**
- Recebe: { processo_id, cliente_email }
- Valida: Cliente é dono do processo?
- Cria: SolicitacaoCopiaEletronicaCliente (status: "pendente_pagamento")
- Retorna: Stripe session para checkout

**Score Esperado:** Checkout 100% integrado

---

#### **Fase A2.3: Testes Funcionais (2 horas)**

✅ Criar solicitação sem erro  
✅ Stripe payment flow completo  
✅ Admin recebe notificação  
✅ Status atualiza após pagamento  

---

### **SPRINT A3: Dashboard Admin Bidirecional (4 dias)**

#### **Fase A3.1: Inbox Admin (4 horas)**

**Página: `AdminSolicitacaoCopias.jsx`**

```
Layout:
[Filtro: pendentes/aceitas/processando/entregues] [Data range] [Search cliente]

Tabela:
| Cliente | Processo | Data Solicitação | Status | Valor | Ações |
|---------|----------|------------------|--------|-------|-------|
| João    | 123456   | 18/02            | ⏳ Pendente | R$ 39,90 | [✓ Aceitar] [✗ Rejeitar] |
```

**Componente: `SolicitacaoCopiaCard.jsx`**
```
- Cliente info (email, nome, telefone)
- Processo info (CNJ, título, área)
- Data solicitação
- Status badge (cores: azul=pendente, verde=processando, etc)
- Ações: Aceitar / Rejeitar / Ver detalhes
- Collapse: Notas admin (opcional)
```

**Score Esperado:** Inbox 100% funcional

---

#### **Fase A3.2: Workflow Aceitar/Rejeitar (3 horas)**

**Modal: `AceitarSolicitacaoModal.jsx`**
```
Passo 1: Confirmar dados (cliente, processo, valor pago)
Passo 2: Upload arquivo PDF (drag & drop)
Passo 3: Validar PDF (size < 50MB, format PDF)
Passo 4: Notas processamento (opcional)
Passo 5: Confirmar aceitação
```

**Modal: `RejeitarSolicitacaoModal.jsx`**
```
Campo: Motivo rejeição (textarea)
Botão: Rejeitar + Notificar Cliente
```

**Backend function: `aceitarSolicitacaoCopia.js`**
```
Entrada: {
  solicitacao_id,
  pdf_file (arquivo),
  notas_admin
}

Processo:
1. Validar arquivo PDF
2. Upload para Storage (PrivateFile)
3. Atualizar SolicitacaoCopiaEletronicaCliente:
   - status: "entregue"
   - pdf_url: FILE_URL
   - data_expiracao: now + 30 dias
4. Criar SolicitacaoCopiaEletronicaAdmin:
   - status_validacao: "aceito"
   - arquivo_gerado_url
5. Disparar evento para Cliente: 'solicitacaoCopiaEntregue'
6. Enviar email cliente com link download + aviso (30 dias)

Saída: { success: true, download_url, expiracao }
```

**Backend function: `rejeitarSolicitacaoCopia.js`**
```
Entrada: { solicitacao_id, motivo }
Processo:
1. Atualizar status: "rejeitado"
2. Reembolsar Stripe (se pagamento processado)
3. Enviar email cliente explicando rejeição
```

**Score Esperado:** Admin workflow 100% funcional

---

#### **Fase A3.3: PDF Viewer Cliente (3 horas)**

**Página: `MinhasCopiasCopiaEletronicas.jsx`**

```
Layout:
[Aba: Cópias disponíveis] [Aba: Histórico cópias]

Cópias Disponíveis:
| Processo | Data Solicitação | Dias Restantes | Ações |
|----------|------------------|-----------------|-------|
| 123456   | 18/02            | 28 dias ⏳      | [👁 Visualizar] [⬇ Baixar] |

Histórico:
| Processo | Data Solicitação | Data Expiração | Motivo expiração | 
|----------|------------------|-----------------|------------------|
| 654321   | 15/02            | 17/03 (expirou) | Arquivos deletados |
```

**Componente: `PDFViewerModal.jsx`**
```
Layout:
[Header: Processo CNJ | Data]
[PDF Viewer (react-pdf ou pdfjs)]
[Toolbar: Zoom | Page indicator | Full screen | Download]
[Footer: "Válido por X dias" | "Baixar cópia"]

Funcionalidades:
- Zoom in/out
- Navegação página
- Fullscreen
- Marcar páginas (bookmark)
- Download botão
- Share link (opcional, com expiração)
```

**Score Esperado:** PDF viewer 100% funcional

---

### **SPRINT A4: Estante Digital + Flipbook (3 dias)**

#### **Fase A4.1: Landing + Contratação (3 horas)**

**Página: `EstanteDigitalLanding.jsx`**

```
Layout:
[Hero] "Estante Digital - Acesse todos os autos do processo"
[Planos]
  Plano 1: Cópia Eletrônica avulsa
    - R$ 39,90 por cópia
    - Válida por 30 dias
    - Sem renovação
    - [Solicitar Cópia]

  Plano 2: Estante Digital (NOVO)
    - 12 x R$ 29,90 (parcelado)
    - OU R$ 297,00 (à vista)
    - Flipbook dos autos
    - Atualizado mensalmente
    - Monitoramento Escavador included
    - [Contratar Anual]

[Comparativa: Cópia vs Estante]
[FAQs]
```

**Componente: `PlanosEstanteDigital.jsx`**
```jsx
// Renderiza 2 cards de plano
// Props: onSelectPlan
// onClick ativa checkout correspondente
```

**Score Esperado:** Landing 100% conversão

---

#### **Fase A4.2: Subscription Flow (4 horas)**

**Backend function: `criarAssinaturaFliBook.js`**
```
Entrada: {
  cliente_email,
  plano: "anual_parcelado_12x" | "anual_avista"
}

Processo:
1. Validar cliente
2. Criar AssinanteFliBook
3. Criar Stripe subscription (recurring) ou one-time payment
4. Enviar email confirmação + acesso Estante Digital
5. Disparar evento: 'assinaturaFliBookCriada'
6. Ativar upgrade monitoramento Escavador (se houver)

Saída: { success: true, subscription_id, acesso_url }
```

**Modal: `ContrataçãoFliBookModal.jsx`**
```
Passo 1: Confirmar plano (12x ou à vista)
Passo 2: Revisar valor total + termos
Passo 3: Checkout Stripe (subscription)
Passo 4: Confirmação + acesso imediato
```

**Score Esperado:** Subscription 100% funcional

---

#### **Fase A4.3: Estante Digital View (5 horas)**

**Página: `MinhaEstanteDigital.jsx`**

```
Layout:
[Header: "Estante Digital" | Status assinatura]
[Sua Assinatura: Ativa até X | Renovar em X | [Gerenciar]]
[Filtros: Por processo | Por data | Por área]
[Grid de processos com flipbook preview]

Cada card:
| Processo CNJ |
| [Flipbook thumb] |
| Área: Cível |
| Atualizado: 18/02 |
| Próxima atualização: 18/03 |
| [👁 Visualizar Flipbook] [⬇ Baixar PDF] |
```

**Componente: `FliBookViewer.jsx`**
```
Integração com biblioteca flipbook (ex: `react-page-flip`)

Renderiza:
- PDFs do processo organizados
- Navegação página-a-página (efeito flipbook)
- Índice de documentos
- Zoom
- Fullscreen
- Download individual de páginas ou tudo
- Data última atualização

Props:
- processo_id
- arquivo_urls: []
- readOnly: true (cliente)
```

**Score Esperado:** Flipbook 100% interativo

---

#### **Fase A4.4: Atualização Mensal Automática (2 horas)**

**Automation (Cron):**
```
Nome: atualizarFliBookMensal
Tipo: scheduled
Frequência: 1º dia de cada mês às 00:00
Ação: Para cada AssinanteFliBook ativo:
  1. Buscar novos autos do Escavador
  2. Gerar PDF compilado
  3. Atualizar arquivo_flipbook
  4. Enviar notificação: "Estante atualizada com novos autos"
```

**Backend function: `processarAtualizacaoFliBook.js`**
```
Lógica:
1. Listar AssinanteFliBook ativos
2. Para cada um:
   - Buscar novos movimentos do Escavador
   - Se houver mudanças:
     - Gerar PDF novo (combinar autos)
     - Upload file
     - Atualizar URL
     - Enviar email notification
3. Log de execução
```

**Score Esperado:** Automação 100% confiável

---

## 🏆 CHECKLIST DE CONCLUSÃO (POR SPRINT)

### Sprint A1 (Headers + Entities)
- [ ] ModuleHeader refatorado em 5 páginas
- [ ] Breadcrumb consistente
- [ ] 3 entities criadas (schema + testes)
- [ ] Zero console errors
- [ ] Score visual: 95%+

### Sprint A2 (Banner + Request Cliente)
- [ ] Banner integrado em ProcessoDetails
- [ ] Modal solicitação completo
- [ ] Stripe checkout funcional
- [ ] Email confirmação enviado
- [ ] Admin dashboard recebe notificação
- [ ] Score funcional: 95%+

### Sprint A3 (Admin Dashboard)
- [ ] Inbox admin listando solicitações
- [ ] Modal aceitar/rejeitar funcional
- [ ] Upload PDF validado
- [ ] PDF viewer renderizando
- [ ] Cliente recebe notificação de entrega
- [ ] Expiração em 30 dias agendada
- [ ] Score: 95%+

### Sprint A4 (Estante Digital)
- [ ] Landing planos renderizando
- [ ] Contratação Stripe (subscription + one-time)
- [ ] Estante digital acessível
- [ ] Flipbook interativo (navegação, zoom)
- [ ] Atualização mensal automática
- [ ] Email notificação mensal
- [ ] Score: 95%+

---

## 💰 MONETIZAÇÃO

| Serviço | Preço | Frequência | Stripe? |
|---------|-------|------------|---------|
| Cópia Eletrônica | R$ 39,90 | Por solicitação | One-time |
| Estante Digital | R$ 29,90 | Mensal (12x) | Subscription |
| Estante Digital | R$ 297,00 | Anual | One-time |
| Upgrade Monitoramento | Incluído | c/ Estante | - |

**Gateway:** Stripe (conectar se não estiver)  
**Reembolso:** Automático se rejeição  
**Recorrência:** Subscription automática (Estante)

---

## 📞 INTEGRAÇÃO ESCAVADOR

```
Quando: Cliente contrata Estante Digital
Ação:
1. Atualizar monitoramento do processo
2. Elevar prioridade de sincronização
3. Incluir no relatório mensal de atualização
4. Notificar cliente de novos movimentos

Custo: Incluído na Estante Digital
```

---

## 🚀 ROADMAP VISUAL

```
Dia 1-2: Sprint A1 (Headers + Entities)      [████░░░░░░░░░░░]
Dia 3-5: Sprint A2 (Banner + Request)        [░░░████░░░░░░░░░]
Dia 6-9: Sprint A3 (Admin + PDF Viewer)      [░░░░░░████░░░░░░]
Dia 10-12: Sprint A4 (Estante + Flipbook)   [░░░░░░░░░░████░░]
```

---

## ⚠️ RISCOS & MITIGAÇÕES

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Stripe não autorizado | BLOCKER | Solicitar OAuth agora |
| PDF muito grande | Delay upload | Compress PDFs antes |
| Flipbook biblioteca pesada | Performance | Lazy load flipbook |
| Atualização mensal falha | Clientes sem autos novos | Retry automático + alert admin |

---

## ✅ PRÓXIMOS PASSOS

1. **Aprovação deste plano** - Validar escopo + timeline
2. **Preparar Sprint A1** - Criar ModuleHeader + Entities
3. **Solicitar OAuth Stripe** - Se não autorizado
4. **Design Flipbook UI** - Escolher biblioteca (react-page-flip, flip-book, etc)
5. **Kick-off Sprint A1** - Sexta-feira próxima

---

**Plano por:** Base44 Agent  
**Data:** 2026-02-18  
**Status:** ⏳ AGUARDANDO APROVAÇÃO