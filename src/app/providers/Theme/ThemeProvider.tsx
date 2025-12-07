import { createContext, type ReactNode, useLayoutEffect, useState } from 'react';

export type Theme = 'dark' | 'light' | 'system';

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'dark',
  setTheme: () => null,
};

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  // Инициализируем тему из localStorage, если задано значение "dark" или "light".
  // В противном случае используем defaultTheme (по умолчанию "dark").
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored === 'dark' || stored === 'light') {
      return stored as Theme;
    }
    return defaultTheme;
  });

  // useLayoutEffect выполняется до отрисовки, что помогает избежать FOUC
  useLayoutEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'system') {
      // Если выбран системный режим, то определяем тему по системным настройкам
      const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const applySystemTheme = () => {
        root.classList.toggle('dark', darkQuery.matches);
      };

      applySystemTheme();

      // Подписываемся на изменение системной темы
      darkQuery.addEventListener('change', applySystemTheme);
      return () => darkQuery.removeEventListener('change', applySystemTheme);
    }
    // Если тема явно выбрана, то просто добавляем или убираем класс 'dark'
    root.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;
    root.classList.add('disable-transitions');
    
    // Force reflow
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    window.getComputedStyle(root).opacity;

    if (newTheme === 'system') {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, newTheme);
    }
    setThemeState(newTheme);

    // Remove class after a small delay to allow the theme change to apply without animation
    setTimeout(() => {
      root.classList.remove('disable-transitions');
    }, 0);
  };

  const value: ThemeProviderState = { theme, setTheme };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
