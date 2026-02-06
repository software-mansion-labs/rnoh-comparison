import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type AccentColors = {
  aqua: string;
  purple: string;
  pink: string;
  green: string;
  blue: string;
  orange: string;
  red: string;
  periwinkle: string;
};

export type ThemeColors = {
  background: string;
  card: string;
  primary: string;
  secondary: string;
  border: string;
  accent: AccentColors;
};

export const darkColors: ThemeColors = {
  background: '#111827',
  card: '#1E293B',
  primary: '#F1F5F9',
  secondary: '#94A3B8',
  border: '#334155',
  accent: {
    aqua: '#67E8F9',
    purple: '#C4B5FD',
    pink: '#F9A8D4',
    green: '#86EFAC',
    blue: '#93C5FD',
    orange: '#FDBA74',
    red: '#FCA5A5',
    periwinkle: '#A5B4FC',
  },
};

export const lightColors: ThemeColors = {
  background: '#F8FAFC',
  card: '#FFFFFF',
  primary: '#0F172A',
  secondary: '#64748B',
  border: '#E2E8F0',
  accent: {
    aqua: '#0891B2',
    purple: '#7C3AED',
    pink: '#DB2777',
    green: '#059669',
    blue: '#2563EB',
    orange: '#EA580C',
    red: '#DC2626',
    periwinkle: '#4F46E5',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
};

type ThemeContextValue = {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const [isDark, setIsDark] = useState(true);
  const toggleTheme = useCallback(() => setIsDark(prev => !prev), []);

  const value = useMemo(
    () => ({
      isDark,
      colors: isDark ? darkColors : lightColors,
      toggleTheme,
    }),
    [isDark, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
