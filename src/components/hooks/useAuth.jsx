import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await base44.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (redirectUrl) => {
    await base44.auth.logout(redirectUrl);
    setUser(null);
    setIsAuthenticated(false);
  };

  return { user, loading, isAuthenticated, logout, refreshAuth: checkAuth };
}