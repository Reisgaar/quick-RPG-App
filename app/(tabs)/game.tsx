// REACT
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Alert, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';

// EXPO
import { useRouter } from 'expo-router';

// TRANSLATIONS
import { useTranslation } from 'react-i18next';

// CONTEXTS
import { useGameContext } from 'src/context/GameContext';
import { useAppSettings } from 'src/context/AppSettingsContext';

// HOOKS
import { useOpenAIKey } from 'src/hooks/useOpenAIKey';
import { useRollD20 } from 'src/hooks/useDice';

// STYLES
import { commonStyles } from 'src/style/styles';

// TYPES
import { ActionOption } from 'src/types/types';

// COMPONENTS
import PageTitle from 'src/components/common/PageTitle';
import CustomButton from 'src/components/common/CustomButton';

export default function GameScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const chatModels = ['gpt-3.5-turbo', 'gpt-4o' , 'gpt-4-turbo'];

    const { currentTheme } = useAppSettings();
    const { apiKey, loading: keyLoading } = useOpenAIKey();
    const { selectedGame, appendToStoryProgressInGame, isGameValid, updatePromptsRemainingInGame } = useGameContext();

    const rollD20 = useRollD20();

    const [loading, setLoading] = useState(false);
    const [storyText, setStoryText] = useState<string | null>(null);
    const [chatModel, setChatModel] = useState<string>('gpt-4o',);
    const [availableActions, setAvailableActions] = useState<ActionOption[]>([]);

    useEffect(() => {
        console.log(selectedGame?.character);
        if (!selectedGame || !isGameValid())
            router.replace('/');
    }, []);

    /**
     * Generates the next part of the story.
     */
    async function generateStory(actionResult?: string, chosenAction?: ActionOption, rollResult?: number) {
        if (!selectedGame || !selectedGame.character || !apiKey) return;

        setLoading(true);
        try {
            const systemMessage = t('chatGpt.systemMessage');

            let userMessage = generatePromptMessage(actionResult, chosenAction, rollResult);
            if (selectedGame.promptsRemaining !== 1)
                userMessage = userMessage + t('chatGpt.userPrompt')

            const data = await callOpenAI(chatModel, systemMessage, userMessage);
            handleStoryResponse(data, userMessage);
        } catch (error) {
            setStoryText(null);
            router.replace('/');
            Alert.alert(t('game.errorNetwork'), String(error));
        } finally {
            setLoading(false);
        }
    }

    /**
     * Generates the prompt to send to AI.
     */
    function generatePromptMessage(actionResult?: string, chosenAction?: ActionOption, rollResult?: number): string {
        if (!selectedGame) return '';

        const isFirstScene = selectedGame.promptsRemaining === selectedGame.totalDecisions;
        const isLastScene = selectedGame.promptsRemaining === 1;
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        return isFirstScene
            ? t('chatGpt.userPromptStart', {
                name: selectedGame.character!.name,
                class: selectedGame.character!.class,
                attributes: selectedGame.character!.attributes,
                theme: t('themes.' + selectedGame.theme),
                promptsRemaining: selectedGame.promptsRemaining,
                initialLeter: alphabet[Math.floor(Math.random() * alphabet.length)],
                containingLetters: alphabet[Math.floor(Math.random() * alphabet.length)] + ", " + alphabet[Math.floor(Math.random() * alphabet.length)] + ", " + alphabet[Math.floor(Math.random() * alphabet.length)],
                totalDecisions: selectedGame.totalDecisions
            })
            : isLastScene ? t('chatGpt.userPromptEnd')
            : t(getActVocabularyRoute(selectedGame.totalDecisions!, selectedGame.promptsRemaining!), {
                decision: chosenAction?.description,
                roll: rollResult,
                result: actionResult,
                promptsRemaining: selectedGame.promptsRemaining,
                totalDecisions: selectedGame.totalDecisions
            });
    }

    /**
     * Get the vocabulary route for corresponding story part.
     */
    function getActVocabularyRoute(total: number, remaining: number): string {
        if (total === 5)
            return "chatGpt.userPromptAct" + (6 - remaining);

        const percentage = 100 - (remaining * 100 / total);
        let act = percentage < 22 ? 1
            : percentage < 47 ? 2
            : percentage < 65 ? 3
            : percentage < 90 ? 4
            : 5;

        return "chatGpt.userPromptAct" + act;
    }

    /**
     * Calls open AI with given message.
     */
    async function callOpenAI(model: string, systemMessage: string, userMessage: string): Promise<any> {
        const messages = [
            { role: 'system', content: systemMessage },
            ...selectedGame!.storyProgress,
            { role: 'user', content: userMessage },
        ];
    
        const body = { model, messages, max_tokens: 1000 };
        const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` };
    
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
            });
    
            return await response.json();
        } catch (error) {
            console.error('OpenAI API error:', error);
            throw error;
        }
    }

    /**
     * Handles the story response and advance if data is correct.
     */
    function handleStoryResponse(data: any, userMessage: string) {
        if (data.error) {
            console.log(data.error.message);
            Alert.alert(t('game.errorApi'), data.error.message || 'Unknown error');
            setStoryText(null);
            return;
        }
    
        const assistantMessage = data.choices[0].message;
        appendToStoryProgressInGame([
            { role: 'user', content: userMessage },
            { role: 'assistant', content: assistantMessage.content }
        ]);
    
        const { story, actions } = extractStoryAndActions(assistantMessage.content);
        setStoryText(story);
        setAvailableActions(actions);
        updatePromptsRemainingInGame(selectedGame!.promptsRemaining! - 1);
    }

    /**
     * Extracts the actions from the received message.
     */
    function extractStoryAndActions(text: string) {
        const jsonMatch = text.match(/({[^{}]*\\?"options"\\?\s*:\s*\[[\s\S]*?\][^{}]*})/);
    
        let story = text;
        let actions: { attribute: string; difficulty: number; description: string }[] = [];
    
        if (jsonMatch) {
            try {
                let cleanedJson = jsonMatch[1].replace(/\\"/g, '"');
                cleanedJson = cleanedJson.replace(/```json\n?|```/g, '').trim();
                const jsonData = JSON.parse(cleanedJson);
                if (jsonData.options && Array.isArray(jsonData.options)) {
                    actions = jsonData.options;
                }
    
                story = text.replace(jsonMatch[0], '').replace(/```json\n?|```/g, '').trim();
            } catch (e) {
                console.error('Error parsing JSON from story text:', e);
            }
        }
    
        return { story, actions };
    }

    /**
     * Handles the action selection by user.
     */
    function handleActionSelection(action: ActionOption) {
        if (action.attribute === "END")
            return endStory();

        const roll = rollD20();
        const attributes = selectedGame!.character?.attributes;
        const attributeValue = attributes ? attributes[action.attribute as keyof typeof attributes] : 0;
        const total = roll + attributeValue;
        const passed = total >= action.difficulty || roll === 20;
        const resultText = passed ? t('game.success') : t('game.failure');
        Alert.alert(`${t('game.result')}: ${passed ? t('game.success') : t('game.failure')}`, `${t("game.action")}: ${action.description}\n${t("game.difficulty")}: ${action.difficulty}\n${t("game.diceRoll")}: ${roll} ${attributeValue >= 0 ? "+ " + attributeValue : "- " + (attributeValue * -1)} (${t("attributes." + action.attribute)})\n${t("game.total")}: ${total}`);
        generateStory(resultText, action, total);
    }
    
    /**
     * Ends the story with an alert.
     */
    function endStory() {
        Alert.alert(t('game.theEnd'), t('game.thanksForPlaying'));
    }
    
    useEffect(() => {
        if (!keyLoading && apiKey && selectedGame && selectedGame.character) {
            generateStory();
        }
    }, [keyLoading, apiKey, chatModel]);

    return (
        <>
            <PageTitle title={t('game.title')} />

            <View
                style={[
                    commonStyles.row,
                    {
                        marginVertical: 0,
                        justifyContent: 'space-around',
                        paddingVertical: 6,
                        backgroundColor: currentTheme.background,
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: currentTheme.text
                    }
                ]}
            >
                {chatModels.map((item) => (
                    <Text
                        key={item}
                        style={{
                            paddingVertical: 2,
                            paddingHorizontal: 10,
                            borderRadius: 8,
                            borderWidth: 2,
                            color: currentTheme.text,
                            borderColor: chatModel === item ? currentTheme.text : 'transparent'
                        }}
                        onPress={() => setChatModel(item)}
                    >{item}</Text>
                ))}
            </View>
            
            <View style={[commonStyles.container, { backgroundColor: currentTheme.background }]}>

                {keyLoading && (
                    <View style={[commonStyles.container, { backgroundColor: currentTheme.background }]}>
                        <ActivityIndicator size="large" color={currentTheme.primary} />
                        <Text style={[commonStyles.noticeText, styles.loadingText, { color: currentTheme.noticeText }]}>{t('game.loadingKey')}</Text>
                    </View>
                )}

                {!apiKey && (
                    <View style={[commonStyles.container, { backgroundColor: currentTheme.background }]}>
                        <Text style={[commonStyles.noticeText, styles.errorText]}>{t('game.noApiKey')}</Text>
                    </View>
                )}

                {!keyLoading && apiKey && (
                    <>
                        <ScrollView
                            style={[styles.scrollView, { backgroundColor: currentTheme.storyBackground }]}
                            contentContainerStyle={{
                                flexGrow: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {loading && (
                                <ActivityIndicator style={{ alignSelf: "center" }} size={'large'} />
                            )}
                            {!loading && storyText && (
                                <Text style={[styles.storyText, { color: currentTheme.storyText }]}>{storyText}</Text>
                            )}
                            {!loading && !storyText && availableActions.length === 0 && (
                                <>
                                    {availableActions.length === 0 && (
                                        <CustomButton text={t('game.tryAgain')} action={() => generateStory()} />
                                    )}
                                    {availableActions.length > 0 && (
                                        <Text style={{color: currentTheme.text}}>{t('game.selectActionAgain')}</Text>
                                    )}
                                </>
                            )}
                        </ScrollView>

                        <Text style={{ color: currentTheme.text, marginTop: 6, marginBottom: 12, textAlign: 'center' }}>{t('game.remainingDecisions')}: {selectedGame?.promptsRemaining}</Text>
 
                        {!loading && availableActions.map((action, index) => (
                            <Pressable
                                key={index}
                                style={[commonStyles.button, { marginTop: 6, marginBottom: 6, paddingHorizontal: 8, paddingVertical: 6, backgroundColor: currentTheme.buttonBackground }]}
                                onPress={() => handleActionSelection(action)}
                            >
                                <Text style={[commonStyles.buttonText, { fontSize: 12, color: currentTheme.buttonText }]}>
                                    {action.description}
                                </Text>
                            </Pressable>
                        ))}
                    </>
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    storyText: {
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 12,
    },
    loadingText: {
        marginTop: 8,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        marginTop: 8,
        textAlign: 'center',
    },
    scrollView: {
        maxHeight: '60%',
        paddingHorizontal: 8,
        borderRadius: 8,
        alignContent: "center",
    },
});
