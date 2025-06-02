export type Game = {
    theme: string | null;
    character: Character | null;
    storyProgress: ChatMessage[];
    totalDecisions: number | null;
    promptsRemaining: number | null;
};

export type ChatMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
};

export type Character = {
    id: string;
    name: string;
    class: string;
    attributes: Attributes;
    description: string;
};

export type Attributes = {
    STR: number;
    DEX: number;
    INT: number;
    CHA: number;
    WIS: number;
    CON: number;
};

export type ActionOption = {
    attribute: string;
    difficulty: number;
    description: string;
};
