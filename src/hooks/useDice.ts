export function useRollD20(): () => number {
    return () => Math.floor(Math.random() * 20) + 1;
}
