import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';

export default function OnboardingAdmin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await base44.auth.me();
    setUser(currentUser);
    if (currentUser.onboarding_completed) {
      navigate(createPageUrl('Dashboard'));
    }
  };

  const handleComplete = async () => {
    setCompleted(true);
    await base44.auth.updateMe({ 
      onboarding_completed: true,
      first_login_date: new Date().toISOString()
    });
    setTimeout(() => {
      navigate(createPageUrl('Dashboard'));
    }, 1500);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--brand-primary-50)] to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--brand-primary)] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              Bem-vindo, {user.full_name}!
            </h1>
            <p className="text-[var(--text-secondary)]">
              Sua conta administrativa está pronta
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 p-4 bg-[var(--brand-primary-50)] rounded-lg">
              <Check className="w-5 h-5 text-[var(--brand-primary)] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-[var(--text-primary)]">Acesso Total</p>
                <p className="text-sm text-[var(--text-secondary)]">Gerencie consultas, comunicações e processos</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-[var(--brand-primary-50)] rounded-lg">
              <Check className="w-5 h-5 text-[var(--brand-primary)] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-[var(--text-primary)]">Integrações Ativas</p>
                <p className="text-sm text-[var(--text-secondary)]">Google Calendar sincronizado e pronto</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-[var(--brand-primary-50)] rounded-lg">
              <Check className="w-5 h-5 text-[var(--brand-primary)] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-[var(--text-primary)]">Escritório Configurado</p>
                <p className="text-sm text-[var(--text-secondary)]">Gestão multiusuário ativada</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleComplete}
            disabled={completed}
            className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] text-white py-6 text-lg"
          >
            {completed ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Redirecionando...
              </>
            ) : (
              <>
                Acessar Painel
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}