import React, { createContext, useContext, useState, ReactNode } from 'react';

type AppMode = 'language' | 'coding';

interface ThemeShadows {
  sm: object;
  md: object;
  lg: object;
  inner?: object; // For claymorphism
}

interface ThemeContextProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  colors: {
    primary: string;
    background: string;
    text: string;
    card: string;
    accent: string;
    border: string;
  };
  roundness: number;
  shadows: ThemeShadows;
  borderWidth: number;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// --- Claymorphism (Language Mode) ---
const languageTheme: Omit<ThemeContextProps, 'mode' | 'setMode'> = {
  colors: {
    primary: '#FF7F50', // Coral
    background: '#F0F8FF', // Alice Blue
    text: '#2D3748',
    card: '#FFFFFF',
    accent: '#87CEFA', // Light Sky Blue
    border: '#E2E8F0',
  },
  roundness: 24, // Soft, rounded corners
  borderWidth: 0, // No harsh borders
  shadows: {
    // Soft, diffused drop shadows
    sm: { shadowColor: '#A0AEC0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 4 },
    md: { shadowColor: '#A0AEC0', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 8 },
    lg: { shadowColor: '#A0AEC0', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.25, shadowRadius: 30, elevation: 12 },
  }
};

// --- Neo-Brutalism (Coding Mode) ---
const codingTheme: Omit<ThemeContextProps, 'mode' | 'setMode'> = {
  colors: {
    primary: '#39FF14', // Hacker Neon Green
    background: '#0D0D0D', // Deep Black
    text: '#FFFFFF',
    card: '#1A1A1A',
    accent: '#FF00FF', // Magenta
    border: '#FFFFFF', // High contrast borders
  },
  roundness: 4, // Sharp corners
  borderWidth: 3, // Thick, harsh borders
  shadows: {
    // Hard, solid drop shadows (offset without blur)
    sm: { shadowColor: '#39FF14', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 0 },
    md: { shadowColor: '#39FF14', shadowOffset: { width: 6, height: 6 }, shadowOpacity: 1, shadowRadius: 0, elevation: 0 },
    lg: { shadowColor: '#39FF14', shadowOffset: { width: 10, height: 10 }, shadowOpacity: 1, shadowRadius: 0, elevation: 0 },
  }
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<AppMode>('language');

  const activeTheme = mode === 'language' ? languageTheme : codingTheme;

  return (
    <ThemeContext.Provider value={{ mode, setMode, ...activeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
