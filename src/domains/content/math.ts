import katex from 'katex';

export function containsMath(text: string): boolean {
  if (!text) return false;
  return /\$\$[\s\S]+?\$\$|\$[^\$]+?\$|\\\(.+?\\\)|\\\[[\s\S]+?\\\]/.test(text);
}

export function renderLatexInText(text: string): string {
  if (!text) return '';

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

export function sanitizeText(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
