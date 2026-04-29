import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { FileUploader } from '../ui/FileUploader';
import { MdImage, MdDownload, MdRefresh } from 'react-icons/md';
import { useFileManager } from '../../hooks/useFileManager';
import { ToolGuide } from '../ui/ToolGuide';
import { RatingPrompt } from '../ui/RatingPrompt';

export const CompressImageTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionRatio, setCompressionRatio] = useState<number>(50); // 0-100
  const { saveFile } = useFileManager();

  const handleFiles = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setCompressedFile(null);
      setOutputUrl(null);
    }
  };

  const compressImage = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    // map 0-100 to 0.1-1.0
    const maxSizeMB = 1; // max 1MB for aggressive compression
    const quality = (100 - compressionRatio) / 100;
    const fallbackQuality = Math.max(0.1, quality);
    
    const options = {
      maxSizeMB: maxSizeMB,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: fallbackQuality,
    };

    try {
      const result = await imageCompression(file, options);
      const url = URL.createObjectURL(result);
      const fileName = `FileMint_Compressed_${file.name}`;
      
      setCompressedFile(result);
      setOutputUrl(url);
      setResultFileName(fileName);

      saveFile({
        name: fileName,
        toolName: 'Compress Image Size',
        type: result.type,
        size: result.size
      }, result);
    } catch (error) {
      console.error(error);
      alert('Error compressing image.');
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
      
      {compressedFile && file ? (
        <div className="flex flex-col items-center py-4 animate-in zoom-in-95 duration-300 text-center">
          <div className="w-[64px] h-[64px] rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
            <MdImage size={32} />
          </div>
          <h3 className="text-[18px] font-bold text-[#111827] dark:text-gray-100 mb-1 font-display">Image Compressed!</h3>
          <p className="text-[13px] text-[#6B7280] dark:text-gray-400 mb-8 font-medium">Reduced by {(100 - (compressedFile.size / file.size) * 100).toFixed(0)}%.</p>
          
          <div className="flex items-center gap-8 mb-8 p-5 bg-[#F8F9FC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-[16px] w-full justify-center">
            <div className="text-center">
              <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Original</p>
              <p className="text-[16px] font-bold text-[#111827] dark:text-gray-200">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <div className="w-[32px] h-[32px] rounded-full bg-brand-light text-brand-pink flex items-center justify-center">
              <MdRefresh className="rotate-90" />
            </div>
            <div className="text-center">
              <p className="text-[11px] font-bold text-brand-pink uppercase tracking-wider mb-1">New Size</p>
              <p className="text-[16px] font-bold text-brand-pink">{(compressedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={handleDownload}
              className="w-full h-[48px] bg-brand-pink text-white rounded-[12px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-pink/20 active:scale-95 transition-all text-[15px]"
            >
              <MdDownload size={20} /> Download Image
            </button>
            <button 
              onClick={() => { setFile(null); setCompressedFile(null); }}
              className="w-full h-[48px] bg-brand-light text-brand-pink rounded-[12px] font-bold active:scale-95 transition-all text-[14px]"
            >
              Compress Another
            </button>
          </div>
          
          {RatingPrompt && <div className="w-full mt-8"><RatingPrompt /></div>}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {!file ? (
            <FileUploader 
              accept="image/*" 
              multiple={false} 
              onFilesSelected={handleFiles} 
              label="Select image to process"
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
              
              <div className="px-1">
                <div className="flex justify-between items-end mb-4">
                  <div className="flex flex-col">
                    <label className="text-[14px] font-bold text-[#111827] dark:text-gray-100 mb-0.5">Compression Strength</label>
                    <p className="text-[11px] text-[#6B7280] font-medium">Medium (Recommended)</p>
                  </div>
                  <span className="text-[13px] font-bold text-brand-pink bg-brand-light px-3 py-1 rounded-full">{compressionRatio}%</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="90" 
                  step="1"
                  value={compressionRatio} 
                  onChange={(e) => setCompressionRatio(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#F8F9FC] dark:bg-slate-900 rounded-lg appearance-none cursor-pointer accent-brand-pink"
                />
                <div className="flex justify-between mt-3 text-[11px] font-bold text-[#6B7280] dark:text-gray-500 uppercase tracking-tighter">
                  <span>Best Quality</span>
                  <span>Smallest Size</span>
                </div>
              </div>
              
              <button 
                onClick={compressImage}
                disabled={isProcessing}
                className="w-full h-[52px] bg-brand-pink text-white rounded-[12px] font-bold text-[15px] shadow-lg shadow-brand-pink/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-2"
              >
                {isProcessing ? 'Reducing file size...' : 'Compress Image Now'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TOOL GUIDE SECTION */}
      <ToolGuide 
        toolName="Compress Image"
        description="Reduce image file size instantly while keeping the visual quality high. Perfect for saving space and faster uploads."
        steps={[
          "Choose the photo you want to compress from your gallery.",
          "Wait for our local algorithm to optimize the file size.",
          "Check the before and after size comparison.",
          "Save the compressed image to your device storage."
        ]}
        useCases={[
          "Shrinking large photos for social media posts.",
          "Optimizing website images for faster performance.",
          "Reducing attachment size for email or messaging.",
          "Saving disk space on smartphones and tablets."
        ]}
        example={{
          input: "Vacation_Photo_5MB.jpg",
          output: "Optimized_Photo_800KB.jpg"
        }}
        seoContent="Compress image online free and shrink file sizes without effort with FileMint. Learn how to compress image without losing quality using the most efficient tools available. Our fast compress image on mobile tool works directly in your browser, making it a secure compress image tool for all your private pictures. No quality loss, just smaller files."
        faqs={[
          { q: "Which formats are supported?", a: "We support JPG, PNG, and WebP compression directly in the browser." },
          { q: "Will my images look blurry?", a: "No, we use smart compression that removes unnecessary data while keeping pixels sharp." },
          { q: "Is there a bulk upload option?", a: "Currently, you can compress images one by one for the best quality control." }
        ]}
      />
    </div>
  );
};
