import { useEffect, useRef } from 'react';
import { reportCustomError } from '@/components/debug/ErrorLogger';

const SCROLL_PERFORMANCE_THRESHOLD = 20; // 50fps = 20ms per frame (tolerância para scroll)
const DEAD_CLICK_TIMEOUT = 3000; // 3s sem resposta = dead click (aumentado para reduzir falsos positivos)

// Whitelist: elementos que não precisam de feedback imediato
const WHITELIST_SELECTORS = [
  '[role="tab"]',
  '[role="button"][aria-selected]',
  'button[data-page]', // Paginação
  'button[aria-label*="page"]',
  '.pagination',
  '[data-testid*="tab"]',
  'button[type="button"]:not([onclick])', // Botões sem handler explícito (delegated events)
  'button[class*="variant-outline"]', // Filtros geralmente são outline
  'button[class*="variant-ghost"]', // Botões de ação secundária
  'button:has(svg)', // Botões com ícones (geralmente têm delegated events)
];

export function useUXTracker() {
  const clickTimestamps = useRef(new Map());
  const scrollStartTime = useRef(null);
  const formSubmissions = useRef(new Map());

  useEffect(() => {
    // 1. DEAD CLICK DETECTION
    const handleClick = (event) => {
      const target = event.target;
      
      // Ignorar elementos na whitelist
      const isWhitelisted = WHITELIST_SELECTORS.some(selector => {
        try {
          return target.matches(selector);
        } catch {
          return false;
        }
      });
      if (isWhitelisted) return;
      
      const isInteractive = target.matches('button, a, [role="button"], [onclick]');
      
      if (isInteractive) {
        const clickId = Date.now() + Math.random();
        const elementInfo = {
          tag: target.tagName,
          className: target.className,
          id: target.id,
          text: target.textContent?.slice(0, 50),
          hasOnClick: !!target.onclick || !!target.getAttribute('onclick'),
          hasHref: target.hasAttribute('href'),
          href: target.getAttribute('href')
        };

        const initialUrl = window.location.href;
        const initialDomSize = document.body.innerHTML.length;

        clickTimestamps.current.set(clickId, {
          timestamp: Date.now(),
          element: elementInfo,
          responded: false,
          initialUrl,
          initialDomSize
        });

        // Verificar se botão sem onClick
        if (target.tagName === 'BUTTON' && !elementInfo.hasOnClick && target.type !== 'submit') {
          reportCustomError(
            `Botão sem onClick: "${elementInfo.text}"`,
            'UX',
            null,
            { 
              element: elementInfo,
              location: window.location.pathname
            }
          );
        }

        // Verificar se link morto
        if (target.tagName === 'A' && (!elementInfo.href || elementInfo.href === '#' || elementInfo.href === 'javascript:void(0)')) {
          reportCustomError(
            `Link morto clicado: "${elementInfo.text}"`,
            'UX',
            null,
            { 
              element: elementInfo,
              location: window.location.pathname
            }
          );
        }

        // Verificar resposta após timeout
        setTimeout(() => {
          const clickData = clickTimestamps.current.get(clickId);
          if (!clickData) return;
          
          if (!clickData.responded) {
            // Verificar se houve resposta legítima
            const urlChanged = window.location.href !== clickData.initialUrl;
            const domChanged = Math.abs(document.body.innerHTML.length - clickData.initialDomSize) > 100;
            const hasLoadingIndicator = document.querySelector('[role="progressbar"], [aria-busy="true"], .animate-spin, [data-loading="true"]');
            const hasActiveState = document.querySelector('[data-state="active"], [aria-pressed="true"], [aria-expanded="true"]');
            const isDebugButton = elementInfo.text?.toLowerCase().includes('limpar') || 
                                 elementInfo.text?.toLowerCase().includes('clear') ||
                                 elementInfo.text?.toLowerCase().includes('export');
            
            // Não reportar se houve mudança válida
            if (!urlChanged && !domChanged && !hasLoadingIndicator && !hasActiveState && !isDebugButton) {
              reportCustomError(
                `Dead click detectado: "${elementInfo.text}" (sem resposta em ${DEAD_CLICK_TIMEOUT}ms)`,
                'UX',
                null,
                { 
                  element: elementInfo,
                  timeout: DEAD_CLICK_TIMEOUT,
                  location: window.location.pathname,
                  urlChanged,
                  domChanged,
                  hasLoadingIndicator: !!hasLoadingIndicator
                }
              );
            }
          }
          clickTimestamps.current.delete(clickId);
        }, DEAD_CLICK_TIMEOUT);
      }
    };

    // Marcar click como "respondido" quando há navegação ou state change
    const markClickResponded = () => {
      clickTimestamps.current.forEach((click) => {
        click.responded = true;
      });
    };

    // 2. FORM SUBMISSION FAILURES
    const handleSubmit = (event) => {
      const form = event.target;
      const formId = form.id || form.name || 'unnamed-form';
      
      formSubmissions.current.set(formId, {
        timestamp: Date.now(),
        action: form.action,
        method: form.method,
        fieldCount: form.elements.length
      });

      // Verificar se form submit falhou
      setTimeout(() => {
        const formData = formSubmissions.current.get(formId);
        if (formData) {
          // Se ainda está no map, provavelmente não teve sucesso
          reportCustomError(
            `Form submission possivelmente falhou: ${formId}`,
            'UX',
            null,
            { 
              formId,
              formData,
              location: window.location.pathname
            }
          );
          formSubmissions.current.delete(formId);
        }
      }, 3000);
    };

    const handleFormSuccess = () => {
      // Limpar todos forms pendentes (assumindo sucesso global)
      formSubmissions.current.clear();
    };

    // 3. SCROLL PERFORMANCE
    let lastScrollTime = null;
    let scrollFrames = [];

    const handleScroll = () => {
      const now = performance.now();
      
      if (scrollStartTime.current === null) {
        scrollStartTime.current = now;
      }

      if (lastScrollTime !== null) {
        const frameDuration = now - lastScrollTime;
        scrollFrames.push(frameDuration);

        if (frameDuration > SCROLL_PERFORMANCE_THRESHOLD) {
          reportCustomError(
            `Scroll janky detectado: ${Math.round(frameDuration)}ms/frame`,
            'PERFORMANCE',
            null,
            { 
              frameDuration,
              threshold: SCROLL_PERFORMANCE_THRESHOLD,
              fps: Math.round(1000 / frameDuration),
              location: window.location.pathname,
              scrollY: window.scrollY
            }
          );
        }
      }

      lastScrollTime = now;

      // Reset após 100ms de inatividade
      clearTimeout(handleScroll.timeout);
      handleScroll.timeout = setTimeout(() => {
        if (scrollFrames.length > 0) {
          const avgFrameTime = scrollFrames.reduce((a, b) => a + b, 0) / scrollFrames.length;
          const jankyFrames = scrollFrames.filter(f => f > SCROLL_PERFORMANCE_THRESHOLD).length;
          
          if (jankyFrames > scrollFrames.length * 0.3) { // >30% frames janky
            reportCustomError(
              `Scroll performance ruim: ${jankyFrames}/${scrollFrames.length} frames janky (avg: ${Math.round(avgFrameTime)}ms)`,
              'PERFORMANCE',
              null,
              { 
                avgFrameTime,
                jankyFrames,
                totalFrames: scrollFrames.length,
                location: window.location.pathname
              }
            );
          }
        }
        
        scrollStartTime.current = null;
        lastScrollTime = null;
        scrollFrames = [];
      }, 100);
    };

    // 4. RAGE CLICKS (usuário clicando várias vezes)
    let clickCount = 0;
    let lastClickTarget = null;

    const handleRageClick = (event) => {
      const target = event.target;
      
      if (target === lastClickTarget) {
        clickCount++;
        
        if (clickCount >= 3) {
          reportCustomError(
            `Rage click detectado: usuário clicou ${clickCount}x no mesmo elemento`,
            'UX',
            null,
            { 
              element: {
                tag: target.tagName,
                className: target.className,
                text: target.textContent?.slice(0, 50)
              },
              clickCount,
              location: window.location.pathname
            }
          );
          clickCount = 0; // Reset
        }
      } else {
        clickCount = 1;
        lastClickTarget = target;
      }

      setTimeout(() => {
        clickCount = 0;
        lastClickTarget = null;
      }, 1000);
    };

    // Event Listeners
    document.addEventListener('click', handleClick, true);
    document.addEventListener('click', handleRageClick, true);
    document.addEventListener('submit', handleSubmit, true);
    document.addEventListener('scroll', handleScroll, { passive: true });
    
    // Listeners para marcar clicks como respondidos
    window.addEventListener('popstate', markClickResponded);
    window.addEventListener('hashchange', markClickResponded);
    
    // Listener para form success (toast de sucesso geralmente indica sucesso)
    const toastObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.textContent?.toLowerCase().includes('sucesso')) {
            handleFormSuccess();
            markClickResponded();
          }
        });
      });
    });
    
    const toastContainer = document.querySelector('[data-sonner-toaster]');
    if (toastContainer) {
      toastObserver.observe(toastContainer, { childList: true, subtree: true });
    }

    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('click', handleRageClick, true);
      document.removeEventListener('submit', handleSubmit, true);
      document.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', markClickResponded);
      window.removeEventListener('hashchange', markClickResponded);
      toastObserver.disconnect();
      clearTimeout(handleScroll.timeout);
    };
  }, []);

  return null;
}