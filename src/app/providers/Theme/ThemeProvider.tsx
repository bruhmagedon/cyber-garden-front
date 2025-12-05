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
  theme: 'system',
  setTheme: () => null,
};

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  // Инициализируем тему из localStorage, если задано значение "dark" или "light".
  // В противном случае используем defaultTheme (обычно "system").
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
    // При выборе системного режима удаляем ключ из localStorage,
    // иначе сохраняем выбранную тему
    if (newTheme === 'system') {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, newTheme);
    }
    setThemeState(newTheme);
  };

  const value: ThemeProviderState = { theme, setTheme };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
