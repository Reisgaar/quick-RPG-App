// EXPO
import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

// CONTEXTS
import { GameProvider } from 'src/context/GameContext';
import { AppSettingsProvider } from 'src/context/AppSettingsContext';

// TRANSLATIONS
import 'src/i18n';

// COMPONENTS
import Header from 'src/components/common/Header';

export default function RootLayout() {
    return (
        <AppSettingsProvider>
            <GameProvider>
                <SafeAreaView style={{ flex: 1 }}>
                    <Header />
                    <Slot />
                </SafeAreaView>
            </GameProvider>
        </AppSettingsProvider>
    );
}
