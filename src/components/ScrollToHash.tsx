import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollToHashProps {
  offset?: number;
}

export default function ScrollToHash({ offset = 96 }: ScrollToHashProps) {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (!el) return;

    setTimeout(() => {
      const y =
        el.getBoundingClientRect().top +
        window.pageYOffset -
        offset;

      window.scrollTo({ top: y, behavior: 'smooth' });
    }, 50);
  }, [hash, offset]);

  return null;
}