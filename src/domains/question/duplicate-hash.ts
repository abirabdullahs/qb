import crypto from 'crypto';

/**
 * Normalizes question text by stripping whitespace, converting to lowercase,
 * and removing common punctuation so similar variations produce the same hash.
 */
export function normalizeQuestionText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[\s\t\n\r]+/g, ' ')
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .trim();
}

/**
 * Generates a SHA-256 hash for duplicate question detection.
 */
export function generateDuplicateHash(text: string): string {
  const normalized = normalizeQuestionText(text);
  return crypto.createHash('sha256').update(normalized).digest('hex');
}
