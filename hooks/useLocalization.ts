import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Language } from '../types';
import { translations } from '../constants';

type LocalizationContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations.EN) => string;
};

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(Language.GEO);

  const t = useCallback((key: keyof typeof translations.EN): string => {
    return translations[language][key] || translations[Language.EN][key];
  }, [language]);

  // FIX: Using JSX syntax in a .ts file causes parsing errors. The JSX has been replaced with React.createElement. For better code readability, this file should be renamed to 'useLocalization.tsx'.
  return React.createElement(
    LocalizationContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
