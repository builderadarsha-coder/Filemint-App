import React, { useState, useRef } from 'react';
import { FileUploader } from '../ui/FileUploader';
import { MdImage, MdDownload, MdRefresh } from 'react-icons/md';
import { useFileManager } from '../../hooks/useFileManager';
import { ToolGuide } from '../ui/ToolGuide';

export const ResizeImageTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState('');
  
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [originalRatio, setOriginalRatio] = useState<number>(1);
  const { saveFile } = useFileManager();

  const handleFiles = (files: File[]) => {
    if (files.length > 0) {
      const selected = files[0];
      setFile(selected);
      setOutputUrl(null);
      const url = URL.createObjectURL(selected);
      setImageUrl(url);

      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setOriginalRatio(img.width / img.height);
      };
      img.src = url;
    }
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (maintainRatio) {
      setHeight(Math.round(val / originalRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (maintainRatio) {
      setWidth(Math.round(val * originalRatio));
    }
  };

  const resizeImage = async () => {
    if (!imageUrl) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const fileName = `FileMint_Resize_${Date.now()}.jpg`;
        const dataUrl = canvas.toDataURL(file?.type || 'image/png', 0.9);
        
        setOutputUrl(dataUrl);
        setResultFileName(fileName);

        saveFile({
          name: fileName,
          toolName: 'Resize Image',
          type: `image/jpeg`,
          size: blob.size
        }, blob);
      }, file?.type || 'image/jpeg', 0.9);

    } catch (e) {
      console.error(e);
      alert('Error resizing image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!outputUrl) return;
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = resultFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };


  return (
    <div className="flex flex-col gap-4 w-full animate-in fade-in duration-300">
      
      {outputUrl ? (
        <div className="flex flex-col items-center py-4 animate-in zoom-in-95 duration-300 text-center">
          <div className="w-[64px] h-[64px] rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
            <MdImage size={32} />
          </div>
          <h3 className="text-[18px] font-bold text-[#111827] dark:text-gray-100 mb-1 font-display tracking-tight">Image Resized!</h3>
          <p className="text-[13px] text-[#6B7280] dark:text-gray-400 mb-8 font-medium">New dimensions: {width} × {height}px.</p>
          
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={handleDownload}
              className="w-full h-[48px] bg-brand-pink text-white rounded-[12px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-pink/20 active:scale-95 transition-all"
            >
              <MdDownload size={20} /> Download Image
            </button>
            <button 
              onClick={() => { setFile(null); setImageUrl(null); setOutputUrl(null); }}
              className="w-full h-[48px] bg-brand-light text-brand-pink rounded-[12px] font-bold active:scale-95 transition-all text-[14px]"
            >
              Resize Another
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {!file ? (
            <FileUploader 
              accept="image/*" 
              multiple={false} 
              onFilesSelected={handleFiles} 
              label="Select file to process"
              subLabel="Tap to upload image"
            />
          ) : (
            <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 p-3.5 bg-[#F8F9FC] dark:bg-slate-900/50 rounded-[12px] border border-[#E5E7EB] dark:border-slate-800">
                <div className="w-[44px] h-[44px] bg-brand-light text-brand-pink rounded-[10px] flex items-center justify-center flex-shrink-0">
                  <MdImage size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-[#111827] dark:text-white truncate">{file.name}</p>
                  <p className="text-[12px] font-medium text-[#6B7280]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button onClick={() => setFile(null)} className="text-[12px] font-bold text-brand-pink hover:bg-brand-light px-3 py-1.5 rounded-lg transition-all">Replace</button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[14px] font-bold text-[#111827] dark:text-gray-200 mb-2 block px-1">Width (px)</label>
                  <input 
                    type="number" 
                    value={width}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full bg-[#F8F9FC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 text-[#111827] dark:text-gray-100 rounded-[12px] h-[48px] px-4 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 transition-all text-[15px] font-bold"
                  />
                </div>
                <div>
                  <label className="text-[14px] font-bold text-[#111827] dark:text-gray-200 mb-2 block px-1">Height (px)</label>
                  <input 
                    type="number" 
                    value={height}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full bg-[#F8F9FC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 text-[#111827] dark:text-gray-100 rounded-[12px] h-[48px] px-4 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 transition-all text-[15px] font-bold"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 px-1 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    checked={maintainRatio}
                    onChange={(e) => setMaintainRatio(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-6 h-6 bg-[#F8F9FC] dark:bg-slate-800 border-2 border-[#FFE4EA] dark:border-slate-700 rounded-[8px] peer-checked:bg-brand-pink peer-checked:border-brand-pink transition-all"></div>
                  <svg className="absolute w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 10" fill="none">
                    <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-[14px] text-[#111827] dark:text-gray-400 font-bold">Lock aspect ratio</span>
              </label>
              
              <button 
                onClick={resizeImage}
                disabled={isProcessing || width <= 0 || height <= 0}
                className="w-full h-[52px] bg-brand-pink text-white rounded-[12px] font-bold text-[15px] shadow-lg shadow-brand-pink/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-2"
              >
                {isProcessing ? 'Adjusting dimensions...' : 'Resize Image Now'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TOOL GUIDE SECTION */}
      <ToolGuide 
        toolName="Resize Image"
        description="Change your photo dimensions with high-quality scaling. Maintain aspect ratio to prevent distortion or stretching."
        steps={[
          "Select the image you want to resize.",
          "Enter your preferred width or height in pixels.",
          "Toggle 'Lock Aspect Ratio' to keep the scale consistent.",
          "Process and download your resized image instantly."
        ]}
        useCases={[
          "Creating exact size thumbnails for web design.",
          "Resizing photos for exam application portals.",
          "Scaling down high-res images for faster sharing.",
          "Adjusting dimensions for social media banners."
        ]}
        example={{
          input: "Original_4000x3000.png",
          output: "Resized_1024x768.png"
        }}
        seoContent="Resize image online free and get the perfect dimensions with FileMint. This is the simplest way to resize image without losing quality, built for fast resize image on mobile. Use our secure resize image tool to handle your photos privately on your device. Scaling images has never been faster or easier."
        faqs={[
          { q: "Does it stretch the image?", a: "No, if you keep 'Lock Aspect Ratio' enabled, the proportions will remain perfect." },
          { q: "Is there a maximum dimension?", a: "Most mobile browsers support up to 6000px, but 2000px-3000px is recommended." },
          { q: "What format will it be saved in?", a: "It saves in the same format you uploaded (JPG or PNG)." }
        ]}
      />
    </div>
  );
};
