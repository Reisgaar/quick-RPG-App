// REACT
import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

// EXPO
import { useRouter } from 'expo-router';

// TRANSLATIONS
import { useTranslation } from 'react-i18next';

// CONTEXTS
import { useAppSettings } from 'src/context/AppSettingsContext';
import { useGameContext } from 'src/context/GameContext';

// STYLES
import { commonStyles } from 'src/style/styles';

// TYPES
import { Character } from 'src/types/types';

// COMPONENTS
import PageTitle from 'src/components/common/PageTitle';
import CharacterNameModal from 'src/components/character/CharacterNameModal';

const MAX_POINTS = 8;
const attributesKey = ['STR', 'DEX', 'INT', 'CHA', 'WIS', 'CON'] as const;

type Skill = typeof attributesKey[number];

export default function CharacterCreationScreen() {
    const { t } = useTranslation();
    const router = useRouter();

    const { currentTheme } = useAppSettings();
    const { updateCharacterInGame } = useGameContext();

    const [pointsLeft, setPointsLeft] = useState(MAX_POINTS);
    const MAX_ATTRIBUTE = 5;
    const MIN_ATTRIBUTE = -2;
    const [attributes, setAttributes] = useState<Record<Skill, number>>({
        STR: 0, DEX: 0, INT: 0, CHA: 0, WIS: 0, CON: 0
    });

    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

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
        if (name) {        
            setModalVisible(false);
            confirmName(name);
        }   
    }

    /**
     * Confirms name and goes to game page.
     */
    const confirmName = (name: string) => {
        if (!selectedCharacter) return;

        const finalName = name.trim() || selectedCharacter.name;
        updateCharacterInGame({
            ...selectedCharacter,
            name: finalName,
        });
        router.push('/game');
        setModalVisible(false);
    };

    /**
     * Handles the skill increasing.
     */
    const increase = (skill: Skill) => {
        if (pointsLeft <= 0) return;
        if (attributes[skill] >= MAX_ATTRIBUTE) return;
        setAttributes((prev) => ({ ...prev, [skill]: prev[skill] + 1 }));
        setPointsLeft(pointsLeft - 1);
    };

    /**
     * Handles the skill decreasing.
     */
    const decrease = (skill: Skill) => {
        if (attributes[skill] <= MIN_ATTRIBUTE) return;
        setAttributes((prev) => ({ ...prev, [skill]: prev[skill] - 1 }));
        setPointsLeft(pointsLeft + 1);
    };

    /**
     * Creates the character and calls to open name modal.
     */
    const onConfirm = () => {
        const character: Character = {
            id: 'custom',
            class: 'Custom',
            name: '',
            description: 'Created by user.',
            attributes: {
                STR: attributes.STR,
                DEX: attributes.DEX,
                INT: attributes.INT,
                CHA: attributes.CHA,
                WIS: attributes.WIS,
                CON: attributes.CON
            }
        };
        openNameModal(character);
    };

    return (
        <>
            <PageTitle title={t('characterCreation.title')} showBackButton={true} />
            <View style={[commonStyles.container, { backgroundColor: currentTheme.background }]}>

                <Text style={[{ fontSize: 18, textAlign: 'center', color: currentTheme.text }]}> {t('characterCreation.tip')} </Text>
                <Text style={[commonStyles.subtitle, { textAlign: 'center', marginTop: 10, marginBottom: 40 }]}> {t('characterCreation.pointsLeft', { count: pointsLeft })} </Text>

                {attributesKey.map((skill, index) => (
                    <View key={skill}>
                        <View style={commonStyles.skillRow}>
                            <Text style={[commonStyles.skillLabel, { color: currentTheme.text }]}> {t(`attributes.${skill}`)} </Text>
                            <View style={[commonStyles.row, { alignItems: 'baseline', marginVertical: 0 }]}>
                                <Pressable onPress={() => decrease(skill)} style={[commonStyles.button, { marginBottom: 0, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: currentTheme.buttonBackground }]}>
                                    <Text style={[commonStyles.buttonText, { color: currentTheme.buttonText }]}>-</Text>
                                </Pressable>
                                <Text style={[commonStyles.skillValue, { color: currentTheme.text }]}> {attributes[skill]} </Text>
                                <Pressable onPress={() => increase(skill)} style={[commonStyles.button, { marginBottom: 0, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: currentTheme.buttonBackground }]}>
                                    <Text style={[commonStyles.buttonText, { color: currentTheme.buttonText }]}>+</Text>
                                </Pressable>
                            </View>
                        </View>
                        {index !== attributesKey.length - 1 && (
                            <View style={{ width: '100%', height: 1, backgroundColor: currentTheme.text, marginVertical: 10 }} />
                        )}
                    </View>
                ))}

                <Pressable
                    onPress={onConfirm}
                    style={[
                        commonStyles.confirmButton,
                        {
                            opacity: pointsLeft > 0 ? 0.3 : 1,
                            backgroundColor: pointsLeft > 0
                                ? currentTheme.disabledButtonBackground
                                : currentTheme.confirmButtonBackground
                        }
                    ]}
                    disabled={pointsLeft > 0}
                >
                    <Text style={[commonStyles.confirmButtonText, { color: currentTheme.buttonText }]}> {t('characterCreation.confirm')} </Text>
                </Pressable>
            </View>

            <CharacterNameModal
                isVisible={modalVisible}
                onClose={handleModalClose}
            />
        </>
    );
}
