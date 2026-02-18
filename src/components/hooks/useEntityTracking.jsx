import { useEffect } from 'react';

/**
 * Hook para tracking de entidades abertas em panels/modals
 * Dispara eventos que o ErrorLogger usa para detectar ghost entities
 */
export function useEntityTracking(entityType, entityId, componentName) {
  useEffect(() => {
    if (!entityType || !entityId) return;

    // Notificar que entidade foi aberta
    const openEvent = new CustomEvent('entityPanelOpened', {
      detail: {
        entityType,
        entityId,
        component: componentName || 'unknown',
        timestamp: Date.now()
      }
    });
    window.dispatchEvent(openEvent);

    console.log(`[useEntityTracking] Opened: ${entityType}:${entityId} in ${componentName}`);

    // Cleanup: notificar que entidade foi fechada
    return () => {
      const closeEvent = new CustomEvent('entityPanelClosed', {
        detail: {
          entityType,
          entityId,
          component: componentName || 'unknown',
          timestamp: Date.now()
        }
      });
      window.dispatchEvent(closeEvent);

      console.log(`[useEntityTracking] Closed: ${entityType}:${entityId} in ${componentName}`);
    };
  }, [entityType, entityId, componentName]);
}