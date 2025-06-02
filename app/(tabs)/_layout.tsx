// REACT
import React, { useMemo } from 'react';

// EXPO
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

// CONTEXTS
import { useAppSettings } from 'src/context/AppSettingsContext';

// TRANSLATIONS
import { useTranslation } from 'react-i18next';

export default function TabsLayout() {
    const { currentTheme } = useAppSettings();
    const { t } = useTranslation();

    const screens = useMemo(() => [
        { name: 'home', title: t('tabs.home'), icon: 'home' },
        { name: 'game', title: t('tabs.game'), icon: 'play-circle' },
        { name: 'character', title: t('tabs.character'), icon: 'person' },
    ], [t]);

    return (
        <Tabs
            screenOptions={({ route }) => {
                const screen = screens.find(s => s.name === route.name);
                return {
                    headerShown: false,
                    tabBarActiveTintColor: '#5e60ce',
                    tabBarInactiveTintColor: '#888',
                    tabBarStyle: {
                        paddingBottom: 0,
                        height: 60,
                        elevation: 0, // Android
                        shadowOpacity: 0, // iOS
                        backgroundColor: currentTheme.tabBackground,
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: currentTheme.tabBorder
                    },
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name={(screen?.icon || 'ellipse') as keyof typeof Ionicons.glyphMap}
                            size={size}
                            color={color}
                        />
                    ),
                    tabBarLabel: screen?.title,
                };
            }}
        >
            {screens.map(({ name }) => (
                <Tabs.Screen key={name} name={name} />
            ))}
        </Tabs>
    );
}
