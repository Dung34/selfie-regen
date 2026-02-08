import React, { useRef } from 'react';
import { Button } from './Button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  title?: string;
  description?: string;
  compact?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect,
  title = "Upload a selfie",
  description = "or drag and drop here (optional)",
  compact = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className={`border-2 border-dashed border-gray-300 rounded-lg ${compact ? 'p-4' : 'p-8'} text-center hover:bg-gray-50 transition-colors`}>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <div className={compact ? "flex flex-col items-center space-y-2" : "space-y-4"}>
        <div className="flex justify-center">
          <svg className={`${compact ? 'h-8 w-8' : 'h-12 w-12'} text-gray-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className={`text-sm text-gray-600 ${compact ? 'text-xs' : ''}`}>
          <span className="font-semibold text-blue-600 cursor-pointer" onClick={() => inputRef.current?.click()}>
            {title}
          </span>
          {' '}{!compact && description}
        </div>
        {!compact && <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>}
        <Button variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
          {compact ? 'Select' : 'Select File'}
        </Button>
      </div>
    </div>
  );
};