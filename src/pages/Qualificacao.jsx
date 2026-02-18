import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import QualificationTypeform from '@/components/qualification/QualificationTypeform';

export default function Qualificacao() {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate(createPageUrl('Home'));
  };

  return <QualificationTypeform onComplete={handleComplete} />;
}