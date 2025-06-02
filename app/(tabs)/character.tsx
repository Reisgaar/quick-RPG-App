// REACT
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// CONTEXTS
import { useAppSettings } from 'src/context/AppSettingsContext';
import { useGameContext } from 'src/context/GameContext';

// TRANSLATIONS
import { useTranslation } from 'react-i18next';

export default function CharacterScreen() {
    const { t } = useTranslation();
    const { selectedGame } = useGameContext();
    const { currentTheme } = useAppSettings();

    if (!selectedGame) {
        return (
            <View style={styles.containerCentered}>
                <Text style={styles.text}>{t('game.loading')}</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{selectedGame.character!.name || t('character.unnamed')}</Text>
            <Text style={{ color: currentTheme.text, textAlign: 'center', fontSize: 14, marginBottom: 6, marginTop: -10, fontWeight: 'bold' }}>{t('characters.' + selectedGame.character!.id + '.name') || t('characters.custom')}</Text>
            <Text style={{ color: currentTheme.text, textAlign: 'center', fontSize: 12, marginBottom: 30 }}>{t('characters.' + selectedGame.character!.id + '.description') || ''}</Text>

            <View style={styles.attributesContainer}>
                {Object.entries(selectedGame.character!.attributes).map(([attr, value]) => (
                    <View key={attr} style={styles.attributeRow}>
                        <Text style={styles.attributeName}>{t(`attributes.${attr}`)}</Text>
                        <Text style={styles.attributeValue}>{value}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#121212',
        flexGrow: 1,
    },
    containerCentered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
    text: {
        color: '#ddd',
        fontSize: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#eee',
        marginBottom: 24,
        textAlign: 'center',
    },
    attributesContainer: {
        marginBottom: 30,
        minWidth: 250
    },
    attributeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomColor: '#333',
        borderBottomWidth: 1,
    },
    attributeName: {
        color: '#ccc',
        fontSize: 18,
        textTransform: 'capitalize',
    },
    attributeValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    luckContainer: {
        padding: 15,
        backgroundColor: '#333',
        borderRadius: 10,
    },
    luckText: {
        color: '#ffcc00',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
