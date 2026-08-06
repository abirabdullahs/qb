'use client';

import React from 'react';

interface ImagePreviewProps {
  url: string;
  altText?: string;
  onRemove?: () => void;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export default function ImagePreview({
  url,
  altText = 'Uploaded diagram',
  onRemove,
  width = '100%',
  height = 'auto',
}: ImagePreviewProps) {
  if (!url) return null;

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        borderRadius: '6px',
        overflow: 'hidden',
        border: '1px solid #cbd5e1',
        background: '#f8fafc',
        maxWidth: width,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={altText}
        style={{
          display: 'block',
          width: '100%',
          maxHeight: height === 'auto' ? '280px' : height,
          objectFit: 'contain',
        }}
        referrerPolicy="no-referrer"
      />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          title="Remove image"
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            background: 'rgba(239, 68, 68, 0.9)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            cursor: 'pointer',
            fontWeight: 700,
            lineHeight: '24px',
            textAlign: 'center',
            fontSize: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          &times;
        </button>
      )}
    </div>
  );
}
