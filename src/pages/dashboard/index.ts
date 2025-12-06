import { lazy } from 'react';

// @index(['./**/*Page.tsx'], (f, _) => `export const ${_.pascalCase(f.name)} = lazy(() => import('${f.path}'));`)
export const MainPage = lazy(() => import('./main/MainPage'));
export const SettingsPage = lazy(() => import('./settings/SettingsPage'));
// @endindex
