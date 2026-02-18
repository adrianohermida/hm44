import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useQualification } from '@/components/hooks/useQualification';
import { QUALIFICATION_STEPS } from './QualificationSteps';
import TypeformProgress from './TypeformProgress';
import TypeformStep from './TypeformStep';
import TypeformInput from './TypeformInput';
import TypeformNavigation from './TypeformNavigation';
import QualificationOptions from './QualificationOptions';

export default function QualificationTypeform({ onComplete }) {
  const { currentStep, setCurrentStep, answers, setAnswers, isSubmitting, submitLead } = useQualification();
  const step = QUALIFICATION_STEPS[currentStep];
  const canProgress = answers[step.id] !== undefined && answers[step.id] !== '';

  const handleNext = async () => {
    if (currentStep === QUALIFICATION_STEPS.length - 1) {
      await submitLead();
      onComplete?.();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] py-20">
      <TypeformProgress currentStep={currentStep + 1} totalSteps={QUALIFICATION_STEPS.length} />
      
      <AnimatePresence mode="wait">
        <TypeformStep key={step.id} question={step.question}>
          {step.type === 'options' ? (
            <QualificationOptions
              stepId={step.id}
              selected={answers[step.id]}
              onChange={(val) => setAnswers({...answers, [step.id]: val})}
            />
          ) : (
            <TypeformInput
              value={answers[step.id] || ''}
              onChange={(val) => setAnswers({...answers, [step.id]: val})}
              placeholder="Digite sua resposta..."
              type={step.inputType}
            />
          )}
        </TypeformStep>
      </AnimatePresence>

      <TypeformNavigation
        onNext={handleNext}
        onBack={() => setCurrentStep(prev => prev - 1)}
        canProgress={canProgress}
        isLast={currentStep === QUALIFICATION_STEPS.length - 1}
        isLoading={isSubmitting}
      />
    </div>
  );
}