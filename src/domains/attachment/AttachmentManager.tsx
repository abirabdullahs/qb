'use client';

import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import ImagePreview from './ImagePreview';

export interface AttachmentItem {
  id?: number;
  url: string;
  altText?: string;
}

interface AttachmentManagerProps {
  attachments: AttachmentItem[];
  onChange: (attachments: AttachmentItem[]) => void;
  attachableType?: string;
  attachableId?: number;
  maxImages?: number;
}

export default function AttachmentManager({
  attachments = [],
  onChange,
  attachableType = 'question',
  attachableId = 0,
  maxImages = 5,
}: AttachmentManagerProps) {
  const [altText, setAltText] = useState('');

  const handleUploadSuccess = (url: string, filename: string) => {
    const newItem: AttachmentItem = {
      url,
      altText: altText || filename,
    };
    onChange([...attachments, newItem]);
    setAltText('');
  };

  const handleRemove = (index: number) => {
    const updated = [...attachments];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
        Diagrams & Image Attachments (চিত্র সংযুক্তি)
      </label>

      {attachments.length < maxImages && (
        <div>
          <ImageUploader
            onUploadSuccess={handleUploadSuccess}
            attachableType={attachableType}
            attachableId={attachableId}
          />
        </div>
      )}

      {attachments.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
          {attachments.map((item, idx) => (
            <div key={idx} style={{ maxWidth: '180px' }}>
              <ImagePreview
                url={item.url}
                altText={item.altText || `Attachment ${idx + 1}`}
                onRemove={() => handleRemove(idx)}
                width="180px"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
