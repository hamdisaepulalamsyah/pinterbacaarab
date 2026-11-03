/**
 * Utilitas pemrosesan teks Arab untuk frontend
 */
export const ARABIC_DIACRITICS_REGEX =
  /[\u0610-\u061A\u0640\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g;

export function stripHarakat(text: string | null | undefined): string {
  if (!text) return '';
  return text.replace(ARABIC_DIACRITICS_REGEX, '').trim();
}
