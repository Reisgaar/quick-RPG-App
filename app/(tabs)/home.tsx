// REACT
import { useFocusEffect } from '@react-navigation/native';
import { Alert, View } from 'react-native';

// EXPO
import { useRouter } from 'expo-router';

// TRANSLATIONS
import { useTranslation } from 'react-i18next';

// CONTEXTS
import { useAppSettings } from 'src/context/AppSettingsContext';

// STYLES
import { commonStyles } from 'src/style/styles';

export default function HomeTab() {
    const { t } = useTranslation();
    const router = useRouter();
    const { currentTheme } = useAppSettings();

    useFocusEffect(() => {
        Alert.alert(
            t('game.exit'),
            t('game.exitMessage'),
            [
                {
                    text: t('common.ok'),
                    onPress: () => router.replace('/'),
                },
                {
                    text: t('common.cancel'),
                    onPress: () => router.replace('/game'),
                    style: 'cancel',
                },
            ],
            { cancelable: false }
        );
    });

    return (
        <>
            <View style={[commonStyles.container, { backgroundColor: currentTheme.background }]} />
        </>
    );
}
