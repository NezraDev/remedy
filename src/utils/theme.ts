import { siteData } from '../data.js';

export type Theme = 'light' | 'dark';

export function savedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(siteData.theme.storageKey);
    return value === 'light' || value === 'dark' ? value : null;
  } catch { return null; }
}

export function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function initialTheme(): Theme {
  return savedTheme() || (siteData.theme.defaultMode === 'system' ? systemTheme() : 'dark');
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const colors = theme === 'light' ? siteData.theme.lightColors : siteData.theme.colors;
  const names: Record<string, string> = { background: 'background', surface: 'surface', primary: 'primary', vip: 'vip', text: 'text', textSecondary: 'text-secondary' };
  for (const [name, value] of Object.entries(colors)) root.style.setProperty(`--color-${names[name]}`, value);
  const brand = siteData.theme.colors;
  const semantic = {
    'on-primary': brand.background,
    'image-background': brand.background,
    'on-image': brand.text,
    'on-image-secondary': brand.textSecondary,
    'on-image-accent': brand.vip,
    'image-primary': brand.primary,
    link: theme === 'light' ? siteData.theme.lightLink : brand.primary,
    focus: theme === 'light' ? siteData.theme.lightLink : brand.primary,
    'control-border': theme === 'light' ? siteData.theme.lightControlBorder : brand.textSecondary,
    'button-border': theme === 'light' ? siteData.theme.lightLink : brand.primary,
  };
  for (const [name, value] of Object.entries(semantic)) root.style.setProperty(`--color-${name}`, value);
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}
