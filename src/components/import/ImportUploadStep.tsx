'use client';

import { useRef, useState, DragEvent } from 'react';

interface ImportUploadStepProps {
  onFileSelect: (content: string) => void;
  onCancel: () => void;
}

export default function ImportUploadStep({ onFileSelect, onCancel }: ImportUploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        onFileSelect(content);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="import-upload">
      <div
        className={`import-dropzone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
        <div className="import-dropzone-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <p className="import-dropzone-text">
          Drag and drop your RBC CSV file here
        </p>
        <p className="import-dropzone-subtext">
          or click to browse
        </p>
      </div>

      {error && (
        <p className="import-error">{error}</p>
      )}

      <div className="import-help">
        <p className="import-help-title">Expected format (RBC Bank Statement):</p>
        <p className="import-help-text">
          Account Type, Account Number, Transaction Date, Cheque Number, Description 1, Description 2, CAD$, USD$
        </p>
      </div>

      <div className="form-actions">
        <button type="button" className="form-btn form-btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
