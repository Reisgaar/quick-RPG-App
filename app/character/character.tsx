// REACT
import React from 'react';
import { Text, View } from 'react-native';

// EXPO
import { useRouter, useLocalSearchParams } from 'expo-router';

// TRANSLATIONS
import { useTranslation } from 'react-i18next';

// CONTEXTS
import { useAppSettings } from 'src/context/AppSettingsContext';

// STYLES
import { commonStyles } from 'src/style/styles';

// COMPONENTS
import PageTitle from 'src/components/common/PageTitle';
import CustomButton from 'src/components/common/CustomButton';

export default function CharacterCreationScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { themeId, themeLabel, mode } = useLocalSearchParams<{ themeId: string, themeLabel: string, mode: 'short' | 'long' }>();
    const { currentTheme } = useAppSettings();

    const onSelectTheme = (isCustomCharacter: boolean) => {
        if (isCustomCharacter) {
            router.push(`/character/characterCreation?themeId=${themeId}&themeLabel=${themeLabel}&mode=${mode}`);
        } else {
            router.push(`/character/characterSelect?themeId=${themeId}&themeLabel=${themeLabel}&mode=${mode}`);
        }
    };

    return (
        <>
            <PageTitle title={t('character.title')} showBackButton={true} />
            <View style={[commonStyles.pageContainer, { backgroundColor: currentTheme.background }]}>
                <Text style={{ color: currentTheme.text, marginBottom: 10 }}>
                    {t('character.selectPregen')}
                </Text>
                <CustomButton text={t('home.pregeneratedCharacter')} action={() => onSelectTheme(false)} />
                <Text style={{ color: currentTheme.text, marginTop: 40, marginBottom: 10 }}>
                    {t('character.create')}
                </Text>
                <CustomButton text={t('home.customCharacter')} action={() => onSelectTheme(true)} />
            </View>
        </>
    );
}
