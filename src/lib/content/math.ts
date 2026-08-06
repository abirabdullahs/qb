import katex from 'katex';

/**
 * Checks if text contains LaTeX math delimiters ($...$, $$...$$, \(...\), \[...\])
 */
export function containsMath(text: string): boolean {
  if (!text) return false;
  return /\$\$[\s\S]+?\$\$|\$[^\$]+?\$|\\\(.+?\\\)|\\\[[\s\S]+?\\\]/.test(text);
}

/**
 * Renders LaTeX equations inside text while preserving normal text/Bangla formatting.
 */
export function renderLatexInText(text: string): string {
  if (!text) return '';

  // Match $$...$$ for display math block
  let processed = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
    try {
      return `<div class="katex-display-wrapper" style="margin: 0.75rem 0; overflow-x: auto; text-align: center;">${katex.renderToString(
        math.trim(),
        { displayMode: true, throwOnError: false }
      )}</div>`;
    } catch {
      return `$$${math}$$`;
    }
  });

  // Match $...$ for inline math
  processed = processed.replace(/\$([^\$]+?)\$/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: false,
        throwOnError: false,
      });
    } catch {
      return `$${math}$`;
    }
  });

  return processed;
}

/**
 * Basic HTML sanitization for text content
 */
export function sanitizeText(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
