// REACT
import React from 'react';
import { View, Text } from 'react-native';

// EXPO
import { router } from 'expo-router';

// TRANSLATIONS
import { useTranslation } from 'react-i18next';

// HOOKS
import { useOpenAIKey } from 'src/hooks/useOpenAIKey';

// CONTEXTS
import { useAppSettings } from 'src/context/AppSettingsContext';
import { useGameContext } from 'src/context/GameContext';

// STYLES
import { commonStyles } from 'src/style/styles';

// COMPONENTS
import PageTitle from 'src/components/common/PageTitle';
import CustomButton from 'src/components/common/CustomButton';
import ClickableText from 'src/components/common/ClickableText';

export default function HomeScreen() {
    const { t } = useTranslation();
    const { apiKey, loading } = useOpenAIKey();
    const { currentTheme } = useAppSettings();

    const { resetGame, updatePromptsRemainingInGame, updateTotalDecisionsInGame } = useGameContext();

    React.useEffect(() => {
        resetGame();
        if (!loading && !apiKey) {
            router.replace('/apiKey');
        }
    }, [apiKey, loading]);

    const goToThemeSelect = (mode: 'short' | 'long') => {
        const decisions= mode === 'short' ? 10 : 20;
        updateTotalDecisionsInGame(decisions);
        updatePromptsRemainingInGame(decisions);
        router.push('/themeSelect');
    };

    if (loading || !apiKey) {
        return (
            <View style={[commonStyles.container, { backgroundColor: currentTheme.background }]}>
                <Text style={[commonStyles.title, { color: currentTheme.text }]}>
                    {t('apiKey.loading')}
                </Text>
            </View>
        );
    }

    return (
        <>
            <PageTitle title={t('home.title')} />
            <View style={[commonStyles.pageContainer, { backgroundColor: currentTheme.background }]}>
                <Text style={{ color: currentTheme.text, marginBottom: 4, fontSize: 14, paddingLeft: 6, textTransform: 'uppercase' }}>
                    {t('home.howTo')}
                </Text>
                <View style={[commonStyles.descriptionContainer, { borderColor: currentTheme.text, backgroundColor: currentTheme.innerBackground }]}>
                    <Text style={[commonStyles.description, { color: currentTheme.text }]}>
                        {t('home.description')}
                    </Text>
                    <Text style={[commonStyles.description, { color: currentTheme.text }]}>
                        {t('home.description2')}
                    </Text>
                    <Text style={[commonStyles.description, { color: currentTheme.text }]}>
                        {t('home.description3')}
                    </Text>
                    <Text style={[commonStyles.description, { color: currentTheme.text, marginBottom: 0 }]}>
                        {t('home.description4')}
                    </Text>
                </View>

                <CustomButton text={t('home.shortStory')} action={() => goToThemeSelect('short')} />
                <CustomButton text={t('home.longStory')} action={() => goToThemeSelect('long')} />

                <View style={{ marginTop: 30 }}>
                    <ClickableText text={t('settings.title')} action={() => router.push('/settings')} align='flex-end' />
                </View>
            </View>
        </>
    );
}
