import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  isDark: boolean;
  background: string;
  surface: string;
  surfaceElevated: string;
  card: string;
  cardBorder: string;
  goldBorder: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryText: string;
  badgeBg: string;
  inputBg: string;
  inputBorder: string;
  headerBg: string;
  headerBorder: string;
  tabBg: string;
  tabBorder: string;
  tabActive: string;
  tabInactive: string;
  statusBar: 'light-content' | 'dark-content';
}

const darkColors: ThemeColors = {
  isDark: true,
  background: '#080A0F',
  surface: '#0E121B',
  surfaceElevated: '#131E3A',
  card: '#0E121B',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  goldBorder: 'rgba(212, 175, 55, 0.35)',
  text: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  primary: '#D4AF37',
  primaryText: '#080A0F',
  badgeBg: 'rgba(212, 175, 55, 0.15)',
  inputBg: '#0E121B',
  inputBorder: 'rgba(212, 163, 59, 0.3)',
  headerBg: '#080A0F',
  headerBorder: 'rgba(255, 255, 255, 0.08)',
  tabBg: '#080A0F',
  tabBorder: 'rgba(255, 255, 255, 0.08)',
  tabActive: '#D4AF37',
  tabInactive: '#64748B',
  statusBar: 'light-content',
};

const lightColors: ThemeColors = {
  isDark: false,
  background: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceElevated: '#F8FAFC',
  card: '#FFFFFF',
  cardBorder: '#E2E8F0',
  goldBorder: 'rgba(184, 134, 11, 0.35)',
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  primary: '#B8860B',
  primaryText: '#FFFFFF',
  badgeBg: 'rgba(184, 134, 11, 0.12)',
  inputBg: '#FFFFFF',
  inputBorder: '#CBD5E1',
  headerBg: '#FFFFFF',
  headerBorder: '#E2E8F0',
  tabBg: '#FFFFFF',
  tabBorder: '#E2E8F0',
  tabActive: '#B8860B',
  tabInactive: '#94A3B8',
  statusBar: 'dark-content',
};

interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = '@ead_theme_mode';

const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  colors: darkColors,
  setMode: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setModeState(saved as ThemeMode);
      }
    }).catch(() => {});
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    AsyncStorage.setItem(STORAGE_KEY, newMode).catch(() => {});
  };

  const toggleTheme = () => {
    const nextMode: ThemeMode = mode === 'dark' ? 'light' : 'dark';
    setMode(nextMode);
  };

  const isDarkEffective = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';
  const colors = isDarkEffective ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ mode, colors, setMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
