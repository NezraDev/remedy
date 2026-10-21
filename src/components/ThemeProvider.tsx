import { createContext, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from 'react';
import { siteData } from '../data.js';
import { applyTheme, initialTheme, savedTheme, systemTheme, type Theme } from '../utils/theme';

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void } | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  useLayoutEffect(() => { applyTheme(theme); }, [theme]);
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const updateSystem = () => { if (!savedTheme()) setTheme(systemTheme()); };
    const updateStorage = (event: StorageEvent) => { if (event.key === siteData.theme.storageKey || event.key === null) setTheme(initialTheme()); };
    query.addEventListener('change', updateSystem);
    window.addEventListener('storage', updateStorage);
    return () => { query.removeEventListener('change', updateSystem); window.removeEventListener('storage', updateStorage); };
  }, []);
  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(siteData.theme.storageKey, next); } catch { /* Preference still works when browser storage is unavailable. */ }
    setTheme(next);
  }
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('ThemeProvider is required.');
  return context;
}
