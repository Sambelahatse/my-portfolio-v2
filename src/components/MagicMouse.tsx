import { useEffect } from 'react';

const CDN_URL = 'https://res.cloudinary.com/veseylab/raw/upload/v1684982764/magicmouse-2.0.0.cdn.min.js';

declare global {
  interface Window {
    magicMouse?: (options?: Record<string, unknown>) => void;
  }
}

const MagicMouse: React.FC = () => {
  useEffect(() => {
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (isTouchDevice || prefersReduced) return;
    if (window.magicMouse) return;

    const script = document.createElement('script');
    script.src = CDN_URL;
    script.async = true;
    script.onload = () => {
      window.magicMouse?.({
        cursorOuter: 'circle-basic',
        hoverEffect: 'circle-move',
        hoverItemMove: false,
        defaultCursor: false,
        outerWidth: 30,
        outerHeight: 30,
      });
    };
    document.body.appendChild(script);

    return () => {
      script.remove();
      const cursor = document.getElementById('magicMouseCursor');
      const pointer = document.getElementById('magicPointer');
      cursor?.remove();
      pointer?.remove();
      delete window.magicMouse;
    };
  }, []);

  return null;
};

export default MagicMouse;
