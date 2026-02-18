import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import OnboardingTermos from "@/components/onboarding/OnboardingTermos";
import { CheckCircle } from "lucide-react";

export default function Onboarding() {
  const navigate = useNavigate();
  const [termos, setTermos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

  useEffect(() => {
    loadTermos();
  }, []);

  const loadTermos = async () => {
    const termosData = await base44.entities.TermoLegal.filter({ ativo: true });
    setTermos(termosData);
    setLoading(false);
  };

  const handleAccept = async (aceites) => {
    const savedData = sessionStorage.getItem('onboarding_data') || '{}';
    const onboardingData = JSON.parse(savedData);
    
    sessionStorage.setItem('onboarding_data', JSON.stringify({
      ...onboardingData,
      aceites,
      ip: await fetch('https://api.ipify.org?format=json').then(r => r.json()).then(d => d.ip),
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    }));

    await base44.auth.redirectToLogin(createPageUrl('Dashboard'));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
      <div className="max-w-3xl mx-auto">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-8 h-8 text-[var(--brand-primary)]" />
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Bem-vindo!</h1>
                <p className="text-sm text-[var(--text-secondary)]">Antes de começar, precisamos que você aceite nossos termos</p>
              </div>
            </div>
            <Progress value={50} className="h-2" />
          </CardContent>
        </Card>

        <OnboardingTermos termos={termos} onAccept={handleAccept} />
      </div>
    </div>
  );
}