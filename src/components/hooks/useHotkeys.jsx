import { useEffect, useState } from 'react';

const HOTKEYS_MAP = {
  'ctrl+k': 'search',
  'ctrl+n': 'new',
  'ctrl+e': 'edit',
  'ctrl+s': 'save',
  'ctrl+d': 'delete',
  'esc': 'close',
  'ctrl+/': 'help',
  'g+v': 'goGeral',
  'g+h': 'goHistorico',
  'g+d': 'goDocumentos',
  'g+f': 'goFinanceiro',
  'g+a': 'goAnalytics',
  'r': 'refresh',
  'e': 'edit',
  'p': 'exportPDF',
  'm': 'toggleMonitor'
};

export default function useHotkeys(handlers = {}) {
  const [lastKey, setLastKey] = useState(null);
  const [lastKeyTime, setLastKeyTime] = useState(0);

  useEffect(() => {
    if (!handlers || Object.keys(handlers).length === 0) return;

    const handleKeyDown = (e) => {
      const now = Date.now();
      
      // Ignore if typing in input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      
      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      
      // Handle 'g' prefix combos (within 1 second)
      if (lastKey === 'g' && now - lastKeyTime < 1000) {
        const combo = `g+${key}`;
        const action = HOTKEYS_MAP[combo];
        if (action && handlers[action]) {
          e.preventDefault();
          handlers[action]();
          setLastKey(null);
          return;
        }
      }
      
      // Track 'g' press
      if (key === 'g' && !ctrl) {
        setLastKey('g');
        setLastKeyTime(now);
        return;
      }
      
      // Handle ctrl combos and single keys
      const keyCombo = ctrl ? `ctrl+${key}` : key;
      const action = HOTKEYS_MAP[keyCombo];
      
      if (action && handlers[action]) {
        e.preventDefault();
        handlers[action]();
      }
      
      setLastKey(key);
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers, lastKey, lastKeyTime]);
}

export { HOTKEYS_MAP };