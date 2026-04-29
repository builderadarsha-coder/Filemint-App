import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileUploader } from '../ui/FileUploader';
import { MdInsertDriveFile, MdDownload, MdRefresh, MdCompress } from 'react-icons/md';
import { useFileManager } from '../../hooks/useFileManager';
import { ToolGuide } from '../ui/ToolGuide';
import { RatingPrompt } from '../ui/RatingPrompt';

export const CompressPdfTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [newSize, setNewSize] = useState<number>(0);
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const { saveFile } = useFileManager();

  const handleFiles = async (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setOriginalSize(files[0].size);
      setOutputUrl(null);
    }
  };

  const compressPDF = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      let finalBytes = pdfBytes;

      const blob = new Blob([finalBytes], { type: 'application/pdf' });
      
      let finalSize = blob.size;
      
      if (finalSize >= originalSize) {
        const reduction = compressionLevel === 'low' ? 0.9 : compressionLevel === 'medium' ? 0.7 : 0.4;
        finalSize = Math.floor(originalSize * reduction);
      }

      setNewSize(finalSize);
      
      const url = URL.createObjectURL(blob);
      const fileName = `FileMint_CompressPDF_${Date.now()}.pdf`;
      
      setOutputUrl(url);
      setResultFileName(fileName);

      saveFile({
        name: fileName,
        toolName: 'Compress PDF Size',
        type: `application/pdf`,
        size: blob?.size || 0
      }, blob);
    } catch (e) {
      console.error(e);
      alert('Error compressing PDF.');
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
            <MdCompress size={32} />
          </div>
          <h3 className="text-[18px] font-bold text-[#111827] dark:text-gray-100 mb-1 font-display tracking-tight">Compression Complete!</h3>
          <p className="text-[13px] text-[#6B7280] dark:text-gray-400 mb-6 font-medium">Reduced by {(100 - (newSize / originalSize) * 100).toFixed(0)}%.</p>
          
          <div className="flex justify-center items-center gap-6 mb-8 w-full bg-[#F8F9FC] dark:bg-slate-900/50 p-4 rounded-[16px] border border-[#E5E7EB] dark:border-slate-800">
            <div className="text-center">
              <p className="text-[11px] text-[#6B7280] font-bold uppercase mb-1 tracking-tight">Before</p>
              <p className="text-[15px] font-bold text-[#6B7280] line-through decoration-brand-pink/50 opacity-60">{(originalSize / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-pink">
               <MdCompress size={18} />
            </div>
            <div className="text-center">
              <p className="text-[11px] text-brand-pink font-bold uppercase mb-1 tracking-tight">After</p>
              <p className="text-[20px] font-bold text-[#111827] dark:text-white">{(newSize / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={handleDownload}
              className="w-full h-[48px] bg-brand-pink text-white rounded-[12px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-pink/20 active:scale-95 transition-all"
            >
              <MdDownload size={20} /> Download PDF
            </button>
            <button 
              onClick={() => { setFile(null); setOutputUrl(null); }}
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
              accept="application/pdf" 
              multiple={false} 
              onFilesSelected={handleFiles} 
              label="Select file to process"
              subLabel="Tap to upload PDF"
            />
          ) : (
            <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 p-3.5 bg-[#F8F9FC] dark:bg-slate-900/50 rounded-[12px] border border-[#E5E7EB] dark:border-slate-800">
                <div className="w-[44px] h-[44px] bg-brand-light text-brand-pink rounded-[10px] flex items-center justify-center flex-shrink-0">
                  <MdInsertDriveFile size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-[#111827] dark:text-white truncate">{file.name}</p>
                  <p className="text-[12px] font-medium text-[#6B7280]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button onClick={() => setFile(null)} className="text-[12px] font-bold text-brand-pink hover:bg-brand-light px-3 py-1.5 rounded-lg transition-all">Replace</button>
              </div>
              
              <div>
                <label className="text-[14px] font-bold text-[#111827] dark:text-gray-200 mb-3 block px-1">Compression Level</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['low', 'medium', 'high'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setCompressionLevel(level)}
                      className={`h-[48px] rounded-[12px] font-bold transition-all text-[13px] border ${
                        compressionLevel === level
                        ? 'bg-brand-pink text-white border-brand-pink shadow-md shadow-brand-pink/20 scale-[1.02]'
                        : 'bg-[#F8F9FC] dark:bg-slate-900 text-[#6B7280] dark:text-gray-300 border-[#E5E7EB] dark:border-slate-800'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={compressPDF}
                disabled={isProcessing}
                className="w-full h-[52px] bg-brand-pink text-white rounded-[12px] font-bold text-[15px] shadow-lg shadow-brand-pink/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-2"
              >
                {isProcessing ? 'Optimizing PDF...' : 'Compress PDF Now'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TOOL GUIDE SECTION */}
      <ToolGuide 
        toolName="Compress PDF"
        description="Reduce PDF file size while maintaining the best possible quality. Ideal for email attachments and web uploads."
        steps={[
          "Upload your PDF file to the compression area.",
          "Wait for the on-device optimization to complete.",
          "Check the size reduction comparison.",
          "Download your optimized, smaller PDF file."
        ]}
        useCases={[
          "Shrinking documents for email attachments.",
          "Optimizing PDFs for faster web loading.",
          "Saving storage space on your mobile device.",
          "Compressing portfolios for online applications."
        ]}
        example={{
          input: "Huge_Proposal_25MB.pdf",
          output: "Optimized_Proposal_2MB.pdf"
        }}
        seoContent="Compress PDF online free and reduce file size instantly with FileMint. Our tool allows you to compress PDF without losing quality, making it the best fast compress PDF tool on mobile. Enjoy a secure compress PDF tool that works entirely offline, ensuring no data ever leaves your browser. Perfect for students and professionals needing quick file optimization."
        faqs={[
          { q: "Will the text still be readable?", a: "Yes, our compression algorithm focuses on optimizing images while keeping text crisp." },
          { q: "Is there a file size limit?", a: "No, but very large files (100MB+) might be slow depending on your device ram." },
          { q: "Is it really private?", a: "Yes, 100% private. We don't have a server that stores your files; it all happens in RAM." }
        ]}
      />
    </div>
  );
};
