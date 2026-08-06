'use client';

import React, { useMemo } from 'react';
import { renderLatexInText } from './math';
// @ts-ignore: side-effect CSS import without type declarations
import 'katex/dist/katex.min.css';

interface LatexRendererProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function LatexRenderer({ content, className = '', style }: LatexRendererProps) {
  const htmlContent = useMemo(() => {
    if (!content) return '';
    return renderLatexInText(content);
  }, [content]);

  return (
    <div
      className={`latex-content ${className}`}
      style={{ lineHeight: 1.6, wordBreak: 'break-word', ...style }}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
