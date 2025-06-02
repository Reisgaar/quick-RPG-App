// REACT
import { View, FlatList } from 'react-native';

// EXPO
import { useRouter } from 'expo-router';

// TRANSLATIONS
import { useTranslation } from 'react-i18next';

// DATA
import { themes } from 'src/data/themes';

// CONTEXT
import { useAppSettings } from 'src/context/AppSettingsContext';
import { useGameContext } from 'src/context/GameContext';

// STYLES
import { commonStyles } from 'src/style/styles';

// COMPONENTS
import PageTitle from 'src/components/common/PageTitle';
import CustomButton from 'src/components/common/CustomButton';

export default function ThemeSelectScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { currentTheme } = useAppSettings();
    const { updateThemeInGame } = useGameContext();

    /**
     * Updates the theme and navigates to character page.
     */
    const onSelectTheme = (theme: string) => {
        updateThemeInGame(theme);
        router.push('/character/character');
    };

    return (
        <>
            <PageTitle title={t('themeSelect.title')} showBackButton={true} />
            <View style={[commonStyles.container, { backgroundColor: currentTheme.background }]}>
                <FlatList
                    style={{ marginTop: 20 }}
                    data={themes}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <CustomButton text={t('themes.' + item)} action={() => onSelectTheme(item)} />
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </View>
        </>
    );
}
