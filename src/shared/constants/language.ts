export const LANGUAGES = ['ru', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];
