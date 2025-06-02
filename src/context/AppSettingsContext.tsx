// REACT
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TRANSLATIONS
import i18n from 'i18next';

// THEMES
import { darkTheme, lightTheme, Theme } from 'src/theme/theme';

type ThemeType = 'light' | 'dark';
export type LanguageType = 'en' | 'es' | 'eu';

interface AppSettings {
    themeName: ThemeType;
    currentTheme: Theme;
    setTheme: (theme: ThemeType) => void;
    language: LanguageType;
    setLanguage: (language: LanguageType) => void;
}

const AppSettingsContext = createContext<AppSettings | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [themeName, setThemeName] = useState<ThemeType>('dark');
    const [language, setLanguageState] = useState<LanguageType>('es');

    const currentTheme = themeName === 'dark' ? darkTheme : lightTheme;

    useEffect(() => {
        (async () => {
            const savedTheme = await AsyncStorage.getItem('APP_THEME');
            if (savedTheme === 'light' || savedTheme === 'dark') {
                setThemeName(savedTheme);
            } else {
                const systemTheme = Appearance.getColorScheme() ?? 'dark';
                setThemeName(systemTheme);
            }

            const savedLanguage = await AsyncStorage.getItem('APP_LANGUAGE');
            if (savedLanguage === 'en' || savedLanguage === 'es') {
                setLanguageState(savedLanguage);
            }
        })();
    }, []);

    const setTheme = (newTheme: ThemeType) => {
        setThemeName(newTheme);
        AsyncStorage.setItem('APP_THEME', newTheme);
    };

    const setLanguage = (newLang: LanguageType) => {
        setLanguageState(newLang);
        AsyncStorage.setItem('APP_LANGUAGE', newLang);
        i18n.changeLanguage(newLang);
    };

    return (
        <AppSettingsContext.Provider
            value={{ themeName, currentTheme, setTheme, language, setLanguage }}
        >
            {children}
        </AppSettingsContext.Provider>
    );
};

export function useAppSettings() {
    const context = useContext(AppSettingsContext);
    if (!context) {
        throw new Error('useAppSettings must be used within an AppSettingsProvider');
    }
    return context;
}
