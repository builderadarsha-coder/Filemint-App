import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { FileUploader } from '../ui/FileUploader';
import { MdTranslate, MdDownload, MdRefresh, MdContentCopy } from 'react-icons/md';
import { useFileManager } from '../../hooks/useFileManager';
import { ToolGuide } from '../ui/ToolGuide';

export const OcrTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing...');
  const [extractedText, setExtractedText] = useState<string>('');
  const [resultFileName, setResultFileName] = useState('');
  const { saveFile } = useFileManager();

  const handleFiles = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setImageUrl(URL.createObjectURL(files[0]));
      setExtractedText('');
      setProgress(0);
    }
  };

  const runOCR = async () => {
    if (!file || !imageUrl) return;
    setIsProcessing(true);
    setProgress(0);
    setExtractedText('');

    try {
      const result = await Tesseract.recognize(
        imageUrl,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
              setStatusText(`Scanning... ${Math.round(m.progress * 100)}%`);
            } else {
              setStatusText(m.status);
            }
          }
        }
      );
      
      const fileName = `ocr_${file.name.split('.')[0]}_${Date.now()}.txt`;
      setExtractedText(result.data.text);
      setResultFileName(fileName);
      setIsProcessing(false);

      const blob = new Blob([result.data.text], { type: 'text/plain' });
      saveFile({
        name: fileName,
        toolName: 'Image to Text',
        type: `text/plain`,
        size: blob?.size || 0
      }, blob);
    } catch (e) {
      console.error(e);
      alert('Error extracting text.');
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText);
    alert('Copied to clipboard!');
  };

  const downloadText = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = resultFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="flex flex-col gap-4 w-full animate-in fade-in duration-300">
      
      {extractedText ? (
        <div className="flex flex-col animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-center gap-2 mb-5 text-green-500 font-bold">
            <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center">
              <MdTranslate size={20} />
            </div>
            <span className="text-[17px] font-display tracking-tight">Text Extracted!</span>
          </div>
          
          <div className="mb-6 relative group">
            <textarea 
              readOnly 
              value={extractedText} 
              className="w-full h-[240px] bg-[#F8F9FC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-[12px] p-4 text-[14px] text-[#111827] dark:text-gray-300 focus:outline-none resize-none shadow-inner leading-relaxed font-mono"
            />
            <button 
              onClick={copyToClipboard}
              className="absolute top-3 right-3 p-2.5 bg-white dark:bg-slate-800 rounded-[10px] shadow-sm border border-[#E5E7EB] dark:border-slate-800 text-[#6B7280] hover:text-brand-pink active:scale-95 transition-all"
              title="Copy to Clipboard"
            >
              <MdContentCopy size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button 
              onClick={downloadText}
              className="w-full h-[48px] bg-brand-pink text-white rounded-[12px] font-bold flex justify-center items-center gap-2 shadow-lg shadow-brand-pink/20 active:scale-95 transition-all text-[15px]"
            >
              <MdDownload size={20} /> Save as TXT
            </button>
            <button 
              onClick={() => { setFile(null); setImageUrl(null); setExtractedText(''); }}
              className="w-full h-[48px] bg-brand-light text-brand-pink rounded-[12px] font-bold active:scale-95 transition-all text-[14px]"
            >
              New Scan
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
                  <MdTranslate size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-[#111827] dark:text-white truncate">{file.name}</p>
                  <p className="text-[12px] font-medium text-[#6B7280]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button onClick={() => setFile(null)} className="text-[12px] font-bold text-brand-pink hover:bg-brand-light px-3 py-1.5 rounded-lg transition-all">Replace</button>
              </div>

              <div className="w-full rounded-[16px] overflow-hidden border border-[#E5E7EB] dark:border-slate-800 bg-[#F8F9FC] dark:bg-slate-900 flex items-center justify-center min-h-[180px] shadow-inner p-2">
                {imageUrl && <img src={imageUrl} alt="Preview" className="max-w-full h-auto object-contain max-h-[220px] rounded-[10px]" />}
              </div>
              
              {isProcessing ? (
                <div className="py-3 px-1">
                  <div className="flex justify-between text-[11px] font-bold text-[#6B7280] dark:text-gray-500 uppercase tracking-widest mb-2.5">
                    <span>{statusText}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-brand-light dark:bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-pink transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={runOCR}
                  className="w-full h-[52px] bg-brand-pink text-white rounded-[12px] font-bold shadow-lg shadow-brand-pink/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2 text-[15px]"
                >
                  <MdTranslate size={20} /> Extract Text Now
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* TOOL GUIDE SECTION */}
      <ToolGuide 
        toolName="Image to Text (OCR)"
        description="Convert images with printed text into editable digital documents. Advanced AI recognition handled entirely in your browser."
        steps={[
          "Upload a clear photo of your document or screenshot.",
          "Wait a few seconds for the AI to recognize the characters.",
          "Review the extracted text in the editor area.",
          "Copy the text or download it as a .txt file."
        ]}
        useCases={[
          "Extracting quotes from printed books or posters.",
          "Digitizing physical receipts for expense tracking.",
          "Converting screenshots into editable meeting notes.",
          "Scanning business cards for contact info."
        ]}
        example={{
          input: "Photo_of_a_menu.jpg",
          output: "Digital_text_of_items_and_prices.txt"
        }}
        seoContent="Image to text OCR online free with FileMint, the smarter way to digitize paperwork. Our tool offers the best OCR without losing quality, designed specifically for image to text on mobile browsers. Experience a secure OCR tool that processes text recognition locally, keeping your sensitive document data private. Fast, free, and incredibly accurate."
        faqs={[
          { q: "Which languages are supported?", a: "Currently, it works best with English and Latin-based characters." },
          { q: "Does it work with handwriting?", a: "It is optimized for printed text; handwriting accuracy may vary." },
          { q: "Is there a word limit?", a: "No, you can process images with any amount of text for free." }
        ]}
      />
    </div>
  );
};
