/// <reference types="astro/client" />

interface Window {
  themeManager?: {
    getTheme: () => 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    toggleTheme: () => void;
    subscribe: (callback: (theme: 'light' | 'dark') => void) => () => void;
  };
}
