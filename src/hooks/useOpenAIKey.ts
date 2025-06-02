// REACT
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useOpenAIKey() {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem('OPENAI_API_KEY')
            .then(key => {
                setApiKey(key);
                setLoading(false);
            })
            .catch(() => {
                setApiKey(null);
                setLoading(false);
            });
    }, []);

    const saveApiKey = async (key: string) => {
        try {
            await AsyncStorage.setItem('OPENAI_API_KEY', key);
            setApiKey(key);
        } catch (error) {
            console.error('Error saving API key', error);
        }
    };

    const removeApiKey = async () => {
        try {
            await AsyncStorage.removeItem('OPENAI_API_KEY');
            setApiKey(null);
        } catch (error) {
            console.error('Error removing API key', error);
        }
    };

    return { apiKey, loading, saveApiKey, removeApiKey };
}
