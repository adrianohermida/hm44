import { useState, useEffect } from 'react';

export function useExitIntent(enabled = true) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const hasShown = localStorage.getItem('exit-popup-shown');
    if (hasShown) return;

    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) {
        setShow(true);
        localStorage.setItem('exit-popup-shown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [enabled]);

  return { show, setShow };
}