// REACT
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Linking } from 'react-native';

// EXPO
import { useRouter } from 'expo-router';

// TRANSLATIONS
import { useTranslation } from 'react-i18next';

// CONTEXTS
import { useAppSettings } from 'src/context/AppSettingsContext';

// STYLES
import { commonStyles } from 'src/style/styles';

// HOOKS
import { useOpenAIKey } from 'src/hooks/useOpenAIKey';

// COMPONENTS
import CustomButton from 'src/components/common/CustomButton';
import ClickableText from 'src/components/common/ClickableText';
import PageTitle from 'src/components/common/PageTitle';

export default function ApiKeyScreen() {
    const { t } = useTranslation();
    const { currentTheme } = useAppSettings();
    const { apiKey, loading, saveApiKey } = useOpenAIKey();
    const router = useRouter();

    const [inputKey, setInputKey] = useState(apiKey || '');
    const [saving, setSaving] = useState(false);

    const onSave = async () => {
        if (!inputKey.trim()) {
            Alert.alert(t('apiKey.emptyKeyAlert'));
            return;
        }
        setSaving(true);
        try {
            await saveApiKey(inputKey.trim());
            Alert.alert(t('apiKey.savedAlert'));
            router.replace('/');
        } catch {
            Alert.alert(t('apiKey.errorSaving'));
        } finally {
            setSaving(false);
        }
    };

    const openOpenAILink = async () => {
        const url = 'https://platform.openai.com/account/api-keys';
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(t('apiKey.openLinkError'));
        }
    };

    if (loading) {
        return (
            <View style={commonStyles.container}>
                <Text style={[commonStyles.title, { fontSize: 22, color: currentTheme.text }]}>{t('apiKey.loading')}</Text>
            </View>
        );
    }

    return (
        <>
            <PageTitle title={t('apiKey.title')} showBackButton={true} />
            <View style={[commonStyles.container, { backgroundColor: currentTheme.background }]}>

                <Text style={[commonStyles.title, { fontSize: 22, color: currentTheme.text }]}>{t('apiKey.addKey')}</Text>
                <Text style={[styles.info, { color: currentTheme.text }]}>{t('apiKey.info')}</Text>

                <TextInput
                    style={[styles.input, { backgroundColor: currentTheme.inputBackground, color: currentTheme.text }]}
                    placeholder={t('apiKey.placeholder')}
                    placeholderTextColor={currentTheme.text}
                    value={inputKey}
                    onChangeText={setInputKey}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!saving}
                />
                <Text style={[styles.notice, { color: currentTheme.text }]}>{t('apiKey.keyStorageNotice')}</Text>

                <CustomButton text={t('apiKey.saveButton')} action={onSave} />
                <ClickableText text={t('apiKey.getKeyLink')} action={openOpenAILink} align='center' />

            </View>
        </>
    );
}

const styles = StyleSheet.create({
    info: {
        fontSize: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    notice: {
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 10,
        paddingBottom: 20,
        fontStyle: 'italic',
    },
});
