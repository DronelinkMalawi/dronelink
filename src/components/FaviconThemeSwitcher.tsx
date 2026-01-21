import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function FaviconThemeSwitcher() {
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    const updateFavicon = () => {
      const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');
      
      const lightFavicon = document.getElementById('favicon-light') as HTMLLinkElement;
      const darkFavicon = document.getElementById('favicon-dark') as HTMLLinkElement;
      
      if (lightFavicon && darkFavicon) {
        if (isDark) {
          lightFavicon.removeAttribute('rel');
          darkFavicon.setAttribute('rel', 'icon');
        } else {
          darkFavicon.removeAttribute('rel');
          lightFavicon.setAttribute('rel', 'icon');
        }
      }
    };

    updateFavicon();
  }, [theme, systemTheme]);

  return null;
}