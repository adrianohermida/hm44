import React, { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Save, FileText, DollarSign, TrendingDown, CreditCard, Download, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { createPageUrl } from "@/utils";
import ClienteFormStep from "@/components/editor-plano/ClienteFormStep";
import ClienteFormVisitante from "@/components/editor-plano/ClienteFormVisitante";
import RendasFormStep from "@/components/editor-plano/RendasFormStep";
import DespesasFormStep from "@/components/editor-plano/DespesasFormStep";
import DividasFormStep from "@/components/editor-plano/DividasFormStep";
import DiagnosticoStep from "@/components/editor-plano/DiagnosticoStep";
import VisitanteJornada from "@/components/editor-plano/VisitanteJornada";
import DiagnosticoCTA from "@/components/editor-plano/DiagnosticoCTA";
import ClienteSelectorAdmin from "@/components/editor-plano/admin/ClienteSelectorAdmin";
import ClienteFormAdmin from "@/components/editor-plano/admin/ClienteFormAdmin";
import PlanoAdminHeader from "@/components/editor-plano/admin/PlanoAdminHeader";
import StepNavigation from "@/components/editor-plano/StepNavigation";
import ProgressBar from "@/components/editor-plano/ProgressBar";
import GuestBanner from "@/components/editor-plano/GuestBanner";
import StepContent from "@/components/editor-plano/StepContent";
import FooterActions from "@/components/editor-plano/FooterActions";
import PublicSidebar from "@/components/editor-plano/PublicSidebar";

const STEPS = [
  { id: "cliente", title: "Informações Socioeconômicas", icon: FileText },
  { id: "rendas", title: "Fontes de Renda", icon: DollarSign },
  { id: "despesas", title: "Mínimo Existencial", icon: TrendingDown },
  { id: "dividas", title: "Dívidas", icon: CreditCard },
  { id: "diagnostico", title: "Diagnóstico", icon: FileText }
];

export default function EditorPlano() {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [clienteIdSelecionado, setClienteIdSelecionado] = useState('');
  const [modoNovoCliente, setModoNovoCliente] = useState(false);
  const [planoData, setPlanoData] = useState({
    cliente: { estado_civil: "solteiro", numero_dependentes: 0 },
    rendas: [],
    despesas: [],
    dividas: [],
    credores: []
  });
  const [diagnosticoEnviado, setDiagnosticoEnviado] = useState(false);
  const [enviandoDiagnostico, setEnviandoDiagnostico] = useState(false);

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio', user?.email],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0];
    },
    enabled: !!user && isAdmin
  });

  const { data: clienteSelecionado } = useQuery({
    queryKey: ['cliente-selecionado', clienteIdSelecionado],
    queryFn: async () => {
      const result = await base44.entities.Cliente.filter({ id: clienteIdSelecionado });
      return result[0];
    },
    enabled: !!clienteIdSelecionado && isAdmin
  });

  useEffect(() => {
    checkAuth();
    loadSessionData();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      setIsGuest(false);
      setIsAdmin(userData.role === 'admin');
      
      const savedData = sessionStorage.getItem('plano_guest_data');
      if (savedData) {
        const guestData = JSON.parse(savedData);
        setPlanoData({
          ...guestData,
          cliente: {
            ...guestData.cliente,
            nome_completo: userData.full_name || "",
            email: userData.email || "",
            telefone: ""
          }
        });
        sessionStorage.removeItem('plano_guest_data');
      }
    } catch {
      setIsGuest(true);
      setUser(null);
      setIsAdmin(false);
    }
  };

  const loadSessionData = () => {
    const savedData = sessionStorage.getItem('plano_guest_data');
    if (savedData) {
      setPlanoData(JSON.parse(savedData));
    }
  };

  const saveProgress = () => {
    sessionStorage.setItem('plano_guest_data', JSON.stringify(planoData));
    if (isGuest) {
      toast.info('Dados salvos na sessão. Crie uma conta para não perder seus dados!');
    } else {
      toast.success('Progresso salvo!');
    }
  };

  const canAdvanceToStep = (stepIndex) => {
    if (stepIndex === 0) return true;
    if (stepIndex === 4) {
      return planoData.rendas.length > 0 && planoData.despesas.length > 0 && planoData.dividas.length > 0;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      if (currentStep === 3 && !canAdvanceToStep(4)) {
        toast.error('Preencha todas as etapas anteriores antes de acessar o diagnóstico');
        return;
      }
      saveProgress();
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleEnviarDiagnostico = async (dadosContato) => {
    setEnviandoDiagnostico(true);
    try {
      const leadData = {
        nome: dadosContato.nome,
        email: dadosContato.email,
        telefone: dadosContato.telefone,
        origem: 'plano_pagamento',
        status: 'novo',
        temperatura: 'quente',
        escritorio_id: user?.escritorio_id || 'guest',
        observacoes: `Solicitou diagnóstico de plano de pagamento. Aceites: ${JSON.stringify(dadosContato.aceites)}`,
        dados_diagnostico: JSON.stringify({
          rendas: planoData.rendas,
          despesas: planoData.despesas,
          dividas: planoData.dividas
        })
      };

      if (!user) {
        await base44.entities.Lead.create(leadData);
      }

      toast.success('Diagnóstico enviado! Verifique seu e-mail.');
      setDiagnosticoEnviado(true);
      
      if (!user) {
        setTimeout(() => {
          window.location.href = createPageUrl('Onboarding');
        }, 2000);
      }
    } catch (error) {
      toast.error('Erro ao enviar diagnóstico');
    }
    setEnviandoDiagnostico(false);
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] flex">
      <PublicSidebar />
      <div className="flex-1 h-screen flex flex-col overflow-hidden">
        <div className="border-b border-[var(--border-primary)] bg-[var(--bg-primary)] px-4 md:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                Criar Plano de Pagamento
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Preencha as informações para gerar um diagnóstico completo</p>
            </div>
            <Button variant="outline" onClick={saveProgress} size="sm">
              <Save className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Salvar</span>
            </Button>
          </div>
          
          {isGuest && (
            <Card className="border-l-4 border-l-[var(--brand-warning)] bg-yellow-50 mb-4">
              <CardContent className="p-3 flex items-center justify-between gap-3">
                <p className="text-xs md:text-sm text-[var(--text-primary)]">
                  <strong>🔓 Simulação Gratuita:</strong> Dados salvos apenas nesta sessão.
                </p>
                <Button size="sm" onClick={() => base44.auth.redirectToLogin()} className="bg-[var(--brand-primary)] shrink-0">
                  Criar Conta
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="mb-3">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-[var(--text-secondary)]">
                Etapa {currentStep + 1} de {STEPS.length}
              </span>
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <Badge
                  key={step.id}
                  variant={index === currentStep ? "default" : index < currentStep ? "secondary" : "outline"}
                  className={`whitespace-nowrap text-xs ${
                    canAdvanceToStep(index) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                  } ${index === currentStep ? 'bg-[var(--brand-primary)]' : ''}`}
                  onClick={() => canAdvanceToStep(index) && setCurrentStep(index)}
                >
                  <StepIcon className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">{step.title}</span>
                  <span className="sm:hidden">{index + 1}</span>
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
          <div className="max-w-5xl mx-auto">
            <StepContent step={STEPS[currentStep]}>
            {currentStep === 0 && (
              <>
                {isAdmin && !modoNovoCliente && (
                  <>
                    <ClienteSelectorAdmin 
                      value={clienteIdSelecionado} 
                      onChange={setClienteIdSelecionado}
                      onNovoCliente={() => setModoNovoCliente(true)}
                    />
                    {clienteSelecionado && <PlanoAdminHeader cliente={clienteSelecionado} />}
                  </>
                )}
                {isAdmin && modoNovoCliente && (
                  <ClienteFormAdmin 
                    escritorioId={escritorio?.id}
                    onClienteCreated={(id) => {
                      setClienteIdSelecionado(id);
                      setModoNovoCliente(false);
                      toast.success('Cliente criado e selecionado');
                    }}
                  />
                )}
                {!isAdmin && (isGuest ? (
                  <ClienteFormVisitante 
                    data={planoData.cliente} 
                    onChange={(data) => setPlanoData(p => ({ ...p, cliente: data }))} 
                  />
                ) : (
                  <ClienteFormStep 
                    data={planoData.cliente} 
                    onChange={(data) => setPlanoData(p => ({ ...p, cliente: data }))} 
                  />
                ))}
              </>
            )}
            {currentStep === 1 && (
              <RendasFormStep 
                data={planoData.rendas} 
                onChange={(data) => setPlanoData(p => ({ ...p, rendas: data }))} 
              />
            )}
            {currentStep === 2 && (
              <DespesasFormStep 
                data={planoData.despesas} 
                onChange={(data) => setPlanoData(p => ({ ...p, despesas: data }))} 
              />
            )}
            {currentStep === 3 && (
              <DividasFormStep 
                dividas={planoData.dividas}
                credores={planoData.credores}
                onDividasChange={(data) => setPlanoData(p => ({ ...p, dividas: data }))}
                onCredoresChange={(data) => setPlanoData(p => ({ ...p, credores: data }))}
              />
            )}
            {currentStep === 4 && (
              <div className="space-y-6">
                <DiagnosticoStep 
                  cliente={planoData.cliente}
                  rendas={planoData.rendas}
                  despesas={planoData.despesas}
                  dividas={planoData.dividas}
                />
                {!diagnosticoEnviado && (
                  <DiagnosticoCTA onSubmit={handleEnviarDiagnostico} loading={enviandoDiagnostico} />
                )}
                {diagnosticoEnviado && (
                  <Card className="border-2 border-[var(--brand-success)] bg-green-50">
                    <CardContent className="p-6 text-center">
                      <CheckCircle className="w-12 h-12 text-[var(--brand-success)] mx-auto mb-3" />
                      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Diagnóstico Enviado!</h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Você receberá o diagnóstico completo em seu e-mail em breve.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            </StepContent>
          </div>
        </div>

        <div className="border-t border-[var(--border-primary)] bg-[var(--bg-primary)] px-4 md:px-6 py-3">
          <div className="max-w-5xl mx-auto">
            <FooterActions
              current={currentStep}
              total={STEPS.length}
              onPrev={prevStep}
              onNext={nextStep}
              disablePrev={currentStep === 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}