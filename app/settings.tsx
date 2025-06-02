// REACT
import React from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// EXPO
import { router } from 'expo-router';

// TRANSLATIONS
import { useTranslation } from 'react-i18next';

// STYLES
import { commonStyles } from 'src/style/styles';

// CONTEXTS
import { LanguageType, useAppSettings } from 'src/context/AppSettingsContext';

// COMPONENTS
import PageTitle from 'src/components/common/PageTitle';
import CustomButton from 'src/components/common/CustomButton';

export default function SettingsScreen() {
    const { t } = useTranslation();
    const { themeName, currentTheme, setTheme, language, setLanguage } = useAppSettings();

    const onClearApiKey = () => {
        Alert.alert(
            t('settings.clearApiKeyTitle'),
            t('settings.clearApiKeyConfirm'),
            [
                { text: t('settings.cancel'), style: 'cancel' },
                {
                    text: t('settings.ok'),
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.removeItem('OPENAI_API_KEY');
                        router.replace('/apiKey');
                    },
                },
            ]
        );
    };

    return (
        <>
            <PageTitle title={t('settings.title')} showBackButton={true} />
            <View style={[commonStyles.container, { backgroundColor: currentTheme.background }]}>

                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
                        {t('settings.apiKey')}
                    </Text>
                    
                    <CustomButton text={t('settings.modifyApiKey')} action={() => router.push('/apiKey')} />
                    <CustomButton text={t('settings.clearApiKey')} action={onClearApiKey} />
                </View>

                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
                        {t('settings.theme')}
                    </Text>

                    <View style={commonStyles.row}>
                        <Pressable
                            onPress={() => setTheme('light')}
                            style={[
                                commonStyles.langButton,
                                themeName === 'light' && [commonStyles.selected, { borderColor: currentTheme.buttonBackground }],
                            ]}
                        >
                            <Text style={{ color: currentTheme.text }}>{t('settings.light')}</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setTheme('dark')}
                            style={[
                                commonStyles.langButton,
                                themeName === 'dark' && [commonStyles.selected, { borderColor: currentTheme.buttonBackground }],
                            ]}
                        >
                            <Text style={{ color: currentTheme.text }}>{t('settings.dark')}</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
                        {t('settings.language')}
                    </Text>

                    <View style={commonStyles.row}>
                        {['en', 'es', 'eu'].map((lang) => (
                            <Pressable
                                key={lang}
                                onPress={() => setLanguage(lang as LanguageType)}
                                style={[
                                    commonStyles.langButton,
                                    language === lang && [commonStyles.selected, { borderColor: currentTheme.buttonBackground }],
                                ]}
                            >
                                <Text style={{ color: currentTheme.text }}>{t('language.' + lang)}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 24,
        marginBottom: 12,
        textAlign: 'center',
    },
});
