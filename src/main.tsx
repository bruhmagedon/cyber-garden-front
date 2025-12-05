import { createRoot } from 'react-dom/client';
import { AppInitializer } from './AppInitializer';
import { ThemeProvider } from './app/providers/Theme/ThemeProvider';
import './app/styles/index.css';
import './shared/config/i18n/i18n';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <AppInitializer />
  </ThemeProvider>,
);
