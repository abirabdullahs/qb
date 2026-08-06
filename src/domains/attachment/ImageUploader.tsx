'use client';

import React, { useState, useRef } from 'react';

interface ImageUploaderProps {
  onUploadSuccess: (url: string, filename: string) => void;
  attachableType?: string;
  attachableId?: number;
  label?: string;
}

export default function ImageUploader({
  onUploadSuccess,
  attachableType = 'general',
  attachableId = 0,
  label = 'Upload Image/Diagram',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('attachableType', attachableType);
      formData.append('attachableId', String(attachableId));

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      onUploadSuccess(data.data.url, data.data.filename);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragActive ? '#2563eb' : '#cbd5e1'}`,
          borderRadius: '8px',
          padding: '1rem',
          textAlign: 'center',
          background: dragActive ? '#eff6ff' : '#f8fafc',
          cursor: uploading ? 'wait' : 'pointer',
          transition: 'all 0.15s ease-in-out',
        }}
      >
        {uploading ? (
          <span style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 600 }}>Uploading image...</span>
        ) : (
          <div>
            <span style={{ fontSize: '0.875rem', color: '#475569', fontWeight: 600, display: 'block' }}>
              📷 {label}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Drag & drop image here or click to select (PNG, JPG, SVG max 5MB)
            </span>
          </div>
        )}
      </div>

      {error && (
        <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{error}</div>
      )}
    </div>
  );
}
