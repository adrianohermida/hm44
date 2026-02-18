import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export function useOnboarding() {
  const [integrations, setIntegrations] = useState({
    googlecalendar: false,
    googledrive: false,
    googledocs: false,
    googlesheets: false,
    googleslides: false
  });
  const [loading, setLoading] = useState(false);
  const [completedOnboarding, setCompletedOnboarding] = useState(false);

  useEffect(() => {
    checkIntegrations();
  }, []);

  const checkIntegrations = async () => {
    const user = await base44.auth.me();
    const onboarded = user.onboarding_completed || false;
    setCompletedOnboarding(onboarded);
  };

  const completeOnboarding = async () => {
    await base44.auth.updateMe({ onboarding_completed: true });
    setCompletedOnboarding(true);
  };

  const authorizedCount = Object.values(integrations).filter(Boolean).length;
  const totalCount = Object.keys(integrations).length;

  return {
    integrations,
    setIntegrations,
    loading,
    setLoading,
    completedOnboarding,
    completeOnboarding,
    authorizedCount,
    totalCount
  };
}