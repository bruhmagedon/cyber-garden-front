import { lazy } from 'react';

// @index(['./**/*Page.tsx'], (f, _) => `export const ${_.pascalCase(f.name)} = lazy(() => import('${f.path}'));`)
export const ErrorPage = lazy(() => import('./error/ErrorPage'));
export const NotFoundPage = lazy(() => import('./not-found/NotFoundPage'));
export const AuthPage = lazy(() => import('./auth/AuthPage'));
export const LoginPage = lazy(() => import('./auth/LoginPage'));
export const RegisterPage = lazy(() => import('./auth/RegisterPage'));
export const ForgotPasswordPage = lazy(() => import('./auth/ForgotPasswordPage'));
export const VerifyCodePage = lazy(() => import('./auth/VerifyCodePage'));
export const ResetPasswordPage = lazy(() => import('./auth/ResetPasswordPage'));
// @endindex
