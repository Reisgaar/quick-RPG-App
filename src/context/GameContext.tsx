// REACT
import React, { createContext, useContext, ReactNode, JSX, useState } from 'react';

// TYPES
import { Character, ChatMessage, Game } from 'src/types/types';

interface GameContextType {
    selectedGame: Game | null;
    setSelectedGame: (game: Game | null) => void;
    isGameValid: () => boolean;
    updateThemeInGame: (theme: string | null) => void;
    updateCharacterInGame: (character: Character | null) => void;
    updateStoryProgressInGame: (storyProgress: ChatMessage[]) => void;
    appendToStoryProgressInGame: (newMessages: ChatMessage[]) => void;
    updateTotalDecisionsInGame: (length: number | null) => void;
    updatePromptsRemainingInGame: (promptsRemaining: number | null) => void;
    resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps { children: ReactNode; }

/**
 * Provides game managing functions and data.
 */
export const GameProvider = ({ children }: GameProviderProps): JSX.Element => {
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);

    /**
     * Resets the game.
     */
    const resetGame = (): void => {
        setSelectedGame({
            theme: null,
            character: null,
            storyProgress: [],
            totalDecisions: null,
            promptsRemaining: null
        });
    };

    /**
     * Resets the game.
     */
    const isGameValid = (): boolean => {
        console.log(selectedGame);
        if (!selectedGame) return false;

        const { theme, character, totalDecisions, promptsRemaining } = selectedGame;

        if (!theme || !character || totalDecisions == null || promptsRemaining == null)
            return false;

        return true;
    };

    /**
     * Updates the theme value inside selectedGame.
     */
    const updateThemeInGame = (theme: string | null): void => {
        setSelectedGame((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                theme: theme,
            };
        });
    };

    /**
     * Updates the character value inside selectedGame.
     */
    const updateCharacterInGame = (character: Character | null): void => {
        setSelectedGame((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                character,
            };
        });
    };

    /**
     * Updates the storyProgress value inside selectedGame.
     */
    const updateStoryProgressInGame = (storyProgress: ChatMessage[]): void => {
        setSelectedGame((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                storyProgress: storyProgress,
            };
        });
    };

    /**
     * Appends messages to the storyProgress inside selectedGame.
     */
    const appendToStoryProgressInGame = (newMessages: ChatMessage[]): void => {
        setSelectedGame((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                storyProgress: [...prev.storyProgress, ...newMessages],
            };
        });
};


    /**
     * Updates the totalDecisions value inside selectedGame.
     */
    const updateTotalDecisionsInGame = (totalDecisions: number | null): void => {
        setSelectedGame((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                totalDecisions: totalDecisions,
            };
        });
    };

    /**
     * Updates the promptsRemaining value inside selectedGame.
     */
    const updatePromptsRemainingInGame = (promptsRemaining: number | null): void => {
        setSelectedGame((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                promptsRemaining: promptsRemaining,
            };
        });
    };

    return (
        <GameContext.Provider
            value={{
                selectedGame,
                setSelectedGame,
                isGameValid,
                updateThemeInGame,
                updateCharacterInGame,
                updateStoryProgressInGame,
                appendToStoryProgressInGame,
                updateTotalDecisionsInGame,
                updatePromptsRemainingInGame,
                resetGame,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}

export const useGameContext = (): GameContextType => {
    const context = useContext(GameContext);
    if (!context) throw new Error("useGame must be used within a GameProvider");
    return context;
};
