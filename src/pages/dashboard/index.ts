import { lazy } from 'react';

// @index(['./**/*Page.tsx'], (f, _) => `export const ${_.pascalCase(f.name)} = lazy(() => import('${f.path}'));`)
export const MainPage = lazy(() => import('./main/MainPage'));
export const MeetingsPage = lazy(() => import('./meetings/MeetingsPage'));
export const SettingsPage = lazy(() => import('./settings/SettingsPage'));
export const ProjectsPage = lazy(() => import('./projects/ProjectsPage'));
// @endindex
