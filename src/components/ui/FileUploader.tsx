import React, { useRef } from 'react';
import { MdCloudUpload, MdLock } from 'react-icons/md';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  accept: string;
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
  subLabel?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFilesSelected, 
  accept, 
  multiple = false, 
  maxFiles, 
  label = 'Select file to process',
  subLabel
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      if (maxFiles && files.length > maxFiles) {
        onFilesSelected(files.slice(0, maxFiles));
      } else {
        onFilesSelected(files);
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const defaultSubLabel = subLabel || (multiple ? 'Tap to upload multiple files' : 'Tap to upload a file');

  return (
    <div className="flex flex-col w-full">
      <div 
        className="w-full h-[120px] bg-[#FFF7F9] dark:bg-slate-900/40 rounded-[12px] border-[1.5px] border-dashed border-[#FFCCD6] dark:border-brand-pink/30 flex flex-col items-center justify-center text-center px-4 transition-all duration-200 active:scale-[0.98] cursor-pointer group"
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept={accept} 
          multiple={multiple} 
          className="hidden" 
        />
        
        <div className="w-[42px] h-[42px] rounded-full bg-brand-pink text-white flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110">
          <MdCloudUpload size={22} />
        </div>
        
        <div className="flex flex-col gap-0.5">
          <h3 className="text-[15px] font-bold text-[#111827] dark:text-gray-100">{label}</h3>
          <p className="text-[12px] text-[#6B7280] dark:text-gray-400 font-medium">{defaultSubLabel}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-1.5 mt-2 px-1">
        <span className="text-[12px]">🔒</span>
        <span className="text-[12px] text-[#6B7280] font-medium">
          Your file stays on your device. No upload.
        </span>
      </div>
    </div>
  );
};
