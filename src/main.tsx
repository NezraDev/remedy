import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { siteData } from './data.js';
import { applyTheme, initialTheme } from './utils/theme';
import { ThemeProvider } from './components/ThemeProvider';
import './styles/index.css';

applyTheme(initialTheme());
document.documentElement.style.setProperty('--font-display', `"${siteData.theme.fonts.display}", Georgia, serif`);
document.documentElement.style.setProperty('--font-body', `"${siteData.theme.fonts.body}", sans-serif`);

createRoot(document.getElementById('root')!).render(<StrictMode><ThemeProvider><BrowserRouter><App /></BrowserRouter></ThemeProvider></StrictMode>);
