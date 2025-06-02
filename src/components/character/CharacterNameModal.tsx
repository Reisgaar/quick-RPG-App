// REACT
import React, { JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View, Pressable, Modal, StyleSheet, TextInput } from "react-native";

// CONTEXTS
import { useAppSettings } from "src/context/AppSettingsContext";

type Props = {
    isVisible: boolean
    onClose: (name?: string) => void;
};

/**
 * A header with two icon buttons.
 */
export default function CharacterNameModal({ isVisible, onClose }: Props): JSX.Element {
    const { t } = useTranslation();
    const { currentTheme } = useAppSettings();
    const [customName, setCustomName] = useState('');


    const handleClose = (name?: string): void => {
        if (name)
            onClose(name);
        else
            onClose();
    }

    return (
        <Modal
            animationType="fade"
            transparent
            visible={isVisible}
        >
            <View style={styles.modalBackground}>
                <View style={[styles.modalContainer, { backgroundColor: currentTheme.card }]}>
                    <Text style={[styles.modalTitle, { color: currentTheme.text }]}> {t('characterSelect.enterName')} </Text>
                    <TextInput
                        style={[styles.input, { color: currentTheme.text, borderColor: currentTheme.primary }]}
                        placeholder={t('characterSelect.namePlaceholder')}
                        placeholderTextColor={currentTheme.cardText}
                        value={customName}
                        onChangeText={setCustomName}
                    />
                    <View style={styles.modalButtons}>
                        <Pressable onPress={() => handleClose()} style={{ paddingHorizontal: 10, paddingTop: 16, paddingBottom: 4 }}>
                            <Text style={{ color: currentTheme.primary, fontWeight: 'bold' }}>{t('common.cancel')}</Text>
                        </Pressable>
                        <Pressable onPress={() => handleClose(customName)} style={{ paddingHorizontal: 10, paddingTop: 16, paddingBottom: 4 }}>
                            <Text style={{ color: currentTheme.primary, fontWeight: 'bold' }}>{t('common.ok')}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
    },
    name: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: '80%',
        padding: 20,
        borderRadius: 12,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 2,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
