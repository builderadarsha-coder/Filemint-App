import React, { useState } from 'react';
import { FileUploader } from '../ui/FileUploader';
import { ImageIcon, Wand2, Download, RotateCcw, Palette, CircleOff, Trash2 } from 'lucide-react';
import { useFileManager } from '../../hooks/useFileManager';
import { removeBackground as removeBackgroundImgly } from "@imgly/background-removal";
import { ToolGuide } from '../ui/ToolGuide';

export const BgRemoverTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('Removing background and polishing edges...');
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState('');
  const [bgColor, setBgColor] = useState<string>('transparent');
  const { saveFile } = useFileManager();
  const [errorMsg, setErrorMsg] = useState('');

  const handleFiles = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setImageUrl(URL.createObjectURL(files[0]));
      setOutputUrl(null);
      setBgColor('transparent');
      setErrorMsg('');
    }
  };

  const removeBackground = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg('');
    setProgressMsg('Loading AI Model... First time takes a few seconds.');
    
    try {
      const blob = await removeBackgroundImgly(file, {
        model: 'isnet', // Fixed: Use valid model name
        output: {
          format: 'image/png',
          quality: 0.8 // slight optimization for speed
        },
        progress: (key, current, total) => {
          if (key.includes('fetch')) {
             setProgressMsg(`Downloading AI model: ${Math.round((current / total) * 100)}%`);
          } else {
             setProgressMsg('Processing image...');
          }
        }
      });
      
      const fileName = `FileMint_BGRemove_${Date.now()}.png`;
      const outputDataUrl = URL.createObjectURL(blob);
      setOutputUrl(outputDataUrl);
      setResultFileName(fileName);
      
      saveFile({
        name: fileName,
        toolName: 'Background Remover',
        type: `image/png`,
        size: blob.size
      }, blob);
    } catch (err: any) {
      console.error('BG removal error:', err);
      setErrorMsg(err.message || 'Failed to process image locally.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImageWithBg = async () => {
    if (!outputUrl) return;
    setIsProcessing(true);
    
    try {
      const downloadName = `FileMint_Result_${Date.now()}.png`;
      
      if (bgColor === 'transparent') {
        const response = await fetch(outputUrl);
        const outputBlob = await response.blob();
        saveFile({
          name: downloadName,
          toolName: 'Background Remover',
          type: `image/png`,
          size: outputBlob.size
        }, outputBlob);
        
        const a = document.createElement('a');
        a.href = outputUrl;
        a.download = downloadName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      // Merge foreground with background
      const img = new Image();
      img.src = outputUrl;
      await new Promise(r => { img.onload = r; });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(blob => {
        if (!blob) return;
        saveFile({
          name: downloadName,
          toolName: 'Background Remover',
          type: `image/png`,
          size: blob.size
        }, blob);
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = downloadName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, 'image/png');
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full animate-in fade-in duration-300">
      
      {outputUrl ? (
        <div className="flex flex-col items-center py-2 animate-in zoom-in-95 duration-300">
          <h3 className="text-[18px] font-bold text-[#111827] dark:text-gray-100 mb-6 font-display tracking-tight text-center">Background Removed!</h3>
          
          <div 
            className="w-full mb-8 rounded-[16px] overflow-hidden border border-[#E5E7EB] dark:border-slate-800 relative flex items-center justify-center transition-colors min-h-[220px]" 
            style={
              bgColor === 'transparent' ? 
              { 
                backgroundImage: 'linear-gradient(45deg, #eee 25%, transparent 25%), linear-gradient(-45deg, #eee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(-45deg, transparent 75%, #eee 75%)', 
                backgroundSize: '20px 20px', 
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                backgroundColor: '#ffffff' 
              } : {
                backgroundColor: bgColor
              }
            }
          >
            <img src={outputUrl} alt="Result" className="w-full h-auto object-contain max-h-[280px] relative z-10 p-2 drop-shadow-2xl" />
          </div>

          <div className="w-full mb-8 space-y-4 px-1">
            <label className="text-[14px] font-bold text-[#111827] dark:text-gray-200 mb-3 block">Background Color</label>
            <div className="flex flex-wrap items-center gap-3">
              {[
                { id: 'transparent', color: 'transparent' },
                { id: '#ffffff', color: '#ffffff' },
                { id: '#000000', color: '#000000' },
                { id: '#E0F2FE', color: '#E0F2FE' },
                { id: '#FEF08A', color: '#FEF08A' },
                { id: '#FEE2E2', color: '#FEE2E2' }
              ].map((c) => (
                <button 
                  key={c.id}
                  onClick={() => setBgColor(c.id)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${bgColor === c.id ? 'border-brand-pink scale-110 shadow-md ring-4 ring-brand-pink/10' : 'border-[#E5E7EB] dark:border-slate-700 hover:scale-105 bg-white'}`}
                  style={c.id === 'transparent' ? {} : { backgroundColor: c.color }}
                >
                  {c.id === 'transparent' && (
                     <div className="w-full h-full rounded-full flex items-center justify-center bg-white overflow-hidden shadow-inner">
                       <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(45deg, #eee 25%, transparent 25%), linear-gradient(-45deg, #eee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(-45deg, transparent 75%, #eee 75%)', backgroundSize: '6px 6px' }}></div>
                     </div>
                  )}
                </button>
              ))}
              
              <div className={`relative w-10 h-10 rounded-full border-2 overflow-hidden transition-all ${!['transparent', '#ffffff', '#000000', '#E0F2FE', '#FEF08A', '#FEE2E2'].includes(bgColor) ? 'border-brand-pink scale-110 shadow-md ring-4 ring-brand-pink/10' : 'border-[#E5E7EB] dark:border-slate-700 hover:scale-105 bg-white'}`}>
                <div className="absolute inset-0 pointer-events-none rounded-full" style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}></div>
                <input 
                  type="color" 
                  value={['transparent', '#ffffff', '#000000', '#E0F2FE', '#FEF08A', '#FEE2E2'].includes(bgColor) ? '#FF8A3D' : bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="absolute inset-[-10px] w-16 h-16 cursor-pointer opacity-0"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={downloadImageWithBg}
              disabled={isProcessing}
              className="w-full h-[52px] bg-brand-pink text-white rounded-[12px] font-bold flex justify-center items-center gap-2 shadow-lg shadow-brand-pink/20 active:scale-95 transition-all text-[15px]"
            >
              {isProcessing ? 'Saving image...' : <><Download size={20} /> Download Result</>}
            </button>
            <button 
              onClick={() => { setFile(null); setImageUrl(null); setOutputUrl(null); setBgColor('transparent'); }}
              disabled={isProcessing}
              className="w-full h-[48px] bg-brand-light text-brand-pink rounded-[12px] font-bold active:scale-95 transition-all text-[14px]"
            >
              Process New Image
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
                  <ImageIcon size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-[#111827] dark:text-white truncate">{file.name}</p>
                  <p className="text-[12px] font-medium text-[#6B7280]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button onClick={() => setFile(null)} className="text-[12px] font-bold text-brand-pink hover:bg-brand-light px-3 py-1.5 rounded-lg transition-all">Replace</button>
              </div>
              
              <div className="w-full rounded-[16px] overflow-hidden border border-[#E5E7EB] dark:border-slate-800 bg-[#F8F9FC] dark:bg-slate-900 flex items-center justify-center min-h-[200px] p-2">
                {imageUrl && <img src={imageUrl} alt="Preview" className="max-w-full h-auto object-contain max-h-[260px] rounded-lg shadow-sm" />}
              </div>
              
              {errorMsg && (
                <div className="bg-red-50 dark:bg-red-500/10 text-red-500 px-4 py-3 rounded-xl text-[12px] font-bold text-center border border-red-100 dark:border-red-500/20">
                  {errorMsg}
                </div>
              )}

              <button 
                onClick={removeBackground}
                disabled={isProcessing}
                className="w-full h-[52px] bg-brand-pink text-white rounded-[12px] font-bold shadow-lg shadow-brand-pink/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2 text-[15px]"
              >
                {isProcessing ? 'AI Model is thinking...' : <><Wand2 size={20} strokeWidth={1.5} /> Remove Background</>}
              </button>
              
              {isProcessing && (
                <p className="text-center text-[11px] text-brand-pink dark:text-brand-pink animate-pulse font-bold tracking-widest uppercase">{progressMsg}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* TOOL GUIDE SECTION */}
      <ToolGuide 
        toolName="Background Remover"
        description="Extract subjects from images instantly with AI-powered background removal. Get clean, transparent PNGs in one tap."
        steps={[
          "Upload your image (works best with clear subjects).",
          "Our AI automatically detects and removes the background.",
          "Preview the transparent result on the checkerboard.",
          "Download your subject as a high-quality PNG."
        ]}
        useCases={[
          "Creating product photos for E-commerce.",
          "Designing clean profile pictures for social media.",
          "Removing backgrounds for presentation headshots.",
          "Crafting digital stickers or marketing assets."
        ]}
        example={{
          input: "Photo_with_Busy_Background.jpg",
          output: "Isolated_Subject.png (Transparent)"
        }}
        seoContent="Remove image background online free with FileMint's advanced AI engine. This is the fastest way to remove image background without losing quality on your smartphone. Our secure remove image background tool processes images locally, ensuring your private photos aren't uploaded to any cloud. A completely free and instant transparent PNG generator."
        faqs={[
          { q: "Does it work on complex backgrounds?", a: "It works best when there is high contrast between the subject and the background." },
          { q: "Is the output transparent?", a: "Yes, the tool exports in PNG format with full alpha channel transparency." },
          { q: "Can I use it for commercial work?", a: "Absolutely! There are no restrictions on how you use the generated images." }
        ]}
      />
    </div>
  );
};
