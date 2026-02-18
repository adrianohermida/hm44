import { useState } from 'react';
import { base44 } from '@/api/base44Client';

export function useQualification() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateScore = (data) => {
    let score = 50;
    if (data.valor_total === '50k+') score += 30;
    if (data.situacao === 'execucao') score += 20;
    return score;
  };

  const submitLead = async () => {
    setIsSubmitting(true);
    await base44.entities.Lead.create({
      nome: answers.nome,
      email: answers.email,
      telefone: answers.telefone,
      whatsapp: answers.telefone,
      escritorio_id: 'hermida_maia',
      origem: 'site',
      status: 'qualificado',
      temperatura: answers.valor_total === '50k+' ? 'quente' : 'morno',
      area_interesse: 'superendividamento',
      mensagem: `Tipo: ${answers.tipo_divida}, Valor: ${answers.valor_total}, Renda: ${answers.renda}, Situação: ${answers.situacao}`,
      score: calculateScore(answers),
    });
    setIsSubmitting(false);
  };

  return { currentStep, setCurrentStep, answers, setAnswers, isSubmitting, submitLead };
}