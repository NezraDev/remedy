import { Moon, Sun } from 'lucide-react';
import { siteData } from '../data.js';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const label = theme === 'dark' ? siteData.theme.labels.switchToLight : siteData.theme.labels.switchToDark;
  return <button className="icon-button theme-toggle" type="button" aria-label={label} title={label} onClick={toggleTheme}>{theme === 'dark' ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}</button>;
}
