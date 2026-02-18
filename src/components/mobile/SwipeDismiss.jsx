import { useRef, useEffect, useState } from 'react';

export function useSwipeDismiss(onDismiss, threshold = 100) {
  const ref = useRef(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const elem = ref.current;
    if (!elem) return;

    const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientY);
    const handleTouchEnd = (e) => {
      setTouchEnd(e.changedTouches[0].clientY);
      if (touchStart - e.changedTouches[0].clientY > threshold) {
        onDismiss();
      }
    };

    elem.addEventListener('touchstart', handleTouchStart);
    elem.addEventListener('touchend', handleTouchEnd);

    return () => {
      elem.removeEventListener('touchstart', handleTouchStart);
      elem.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onDismiss, threshold, touchStart]);

  return ref;
}

export default function SwipeDismissZone({ children, onDismiss }) {
  const ref = useSwipeDismiss(onDismiss);
  return <div ref={ref}>{children}</div>;
}