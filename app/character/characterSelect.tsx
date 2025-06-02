// REACT
import React, { useState } from 'react';
import { View, FlatList } from 'react-native';

// EXPO
import { useRouter } from 'expo-router';

// TRANSLATIONS
import { useTranslation } from 'react-i18next';

// DATA
import { charactersByTheme } from 'src/data/themes';

// STYLES
import { commonStyles } from 'src/style/styles';

// CONTEXTS
import { useAppSettings } from 'src/context/AppSettingsContext';
import { useGameContext } from 'src/context/GameContext';

// TYPES
import { Character } from 'src/types/types';

// COMPONENTS
import PageTitle from 'src/components/common/PageTitle';
import CustomButton from 'src/components/common/CustomButton';
import CharacterNameModal from 'src/components/character/CharacterNameModal';

export default function CharacterSelectScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    
    const { currentTheme } = useAppSettings();
    const { selectedGame, updateCharacterInGame } = useGameContext();
    
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const characters = charactersByTheme[selectedGame?.theme!];

    /**
     * Opens the modal to enter the name.
     */
    const openNameModal = (character: Character) => {
        setSelectedCharacter(character);
        setModalVisible(true);
    };

    /**
     * Handles the modal closing
     */
    const handleModalClose = async (name?: string) => {
        setModalVisible(false);
        if (name)
            confirmName(name);
    }

    /**
     * Confirms name and goes to game page.
     */
    const confirmName = (name: string) => {
        if (!selectedCharacter) return;

        const finalName = name.trim();
        updateCharacterInGame({
            ...selectedCharacter,
            name: finalName,
        });
        router.push('/game');
        setModalVisible(false);
    };

    return (
        <>
            <PageTitle title={t('characterSelect.title')} showBackButton={true} />
            <View style={[commonStyles.container, { backgroundColor: currentTheme.background }]}>
                <FlatList
                    style={{ marginTop: 20 }}
                    data={characters}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <CustomButton
                            text={t(`characters.${item.id}.name`, item.name)}
                            secondaryText={t(`characters.${item.id}.description`, item.description)}
                            action={() => openNameModal(item)}
                        />
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />

                {/* MODAL DE NOMBRE */}
                <CharacterNameModal
                    isVisible={modalVisible}
                    onClose={handleModalClose}
                />
            </View>
        </>
    );
}
