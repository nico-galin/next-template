'use client';
import useLocalStorage from 'hooks/useLocalStorage';
import type { ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';
import type colors from 'styles/theme';
import allColors from 'styles/theme';

type ThemeOption = 'light' | 'dark';

interface ThemeContext_Props {
  theme: ThemeOption;
  colors: typeof colors.dark & typeof colors.light;
  setTheme: (arg0: ThemeOption) => void;
  toggleTheme: () => void;
}

interface ThemeProvider_Props {
  children: ReactNode;
}

export const ThemeContext = createContext<ThemeContext_Props | null>(null);

const ThemeProvider = ({ children }: ThemeProvider_Props) => {
  const [theme, setTheme] = useState<ThemeOption>('light');
  const [localTheme, setLocalTheme] = useLocalStorage<ThemeOption>(
    'theme',
    theme,
  );

  const colors = theme == 'dark' ? allColors.dark : allColors.light;

  useEffect(() => {
    setTheme(localTheme);
    document.querySelector('body')?.setAttribute('class', localTheme);
  }, [localTheme]);

  const updateTheme = (newTheme: ThemeContext_Props['theme']) => {
    setLocalTheme(newTheme);
    setTheme(newTheme);
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      setLocalTheme(newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: theme,
        setTheme: updateTheme,
        toggleTheme: toggleTheme,
        colors: colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
