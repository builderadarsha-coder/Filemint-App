import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { FileUploader } from '../ui/FileUploader';
import { MdBrandingWatermark, MdDownload, MdRefresh, MdCheck } from 'react-icons/md';
import { useFileManager } from '../../hooks/useFileManager';
import { ToolGuide } from '../ui/ToolGuide';
import { RatingPrompt } from '../ui/RatingPrompt';

export const WatermarkTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('FileMint');
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState('');
  const { saveFile } = useFileManager();

  const handleFiles = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setOutputUrl(null);
    }
  };

  const addWatermark = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        page.drawText(watermarkText, {
          x: width / 4,
          y: height / 2,
          size: 50,
          font: helveticaFont,
          color: rgb(0.7, 0.7, 0.7),
          rotate: degrees(45),
          opacity: 0.3,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const fileName = `FileMint_Watermarked_${Date.now()}.pdf`;
      
      setOutputUrl(url);
      setResultFileName(fileName);

      saveFile({
        name: fileName,
        toolName: 'Watermark PDF',
        type: 'application/pdf',
        size: blob.size
      }, blob);
    } catch (e) {
      console.error(e);
      alert('Error adding watermark.');
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
            <MdCheck size={32} />
          </div>
          <h3 className="text-[18px] font-bold text-[#111827] dark:text-gray-100 mb-1 font-display tracking-tight">Watermark Added!</h3>
          <p className="text-[13px] text-[#6B7280] dark:text-gray-400 mb-8 font-medium">Your document is now protected.</p>
          
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={handleDownload}
              className="w-full h-[48px] bg-brand-pink text-white rounded-[12px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-pink/20 active:scale-95 transition-all text-[15px]"
            >
              <MdDownload size={20} /> Download PDF
            </button>
            <button 
              onClick={() => { setFile(null); setOutputUrl(null); }}
              className="w-full h-[48px] bg-brand-light text-brand-pink rounded-[12px] font-bold active:scale-95 transition-all text-[14px]"
            >
              Protect Another
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
                  <MdBrandingWatermark size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-[#111827] dark:text-white truncate">{file.name}</p>
                  <p className="text-[12px] font-medium text-[#6B7280]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button onClick={() => setFile(null)} className="text-[12px] font-bold text-brand-pink hover:bg-brand-light px-3 py-1.5 rounded-lg transition-all">Replace</button>
              </div>
              
              <div>
                <label className="text-[14px] font-bold text-[#111827] dark:text-gray-200 mb-3 block px-1">Watermark Label</label>
                <input 
                  type="text" 
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full h-[52px] bg-[#F8F9FC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-[12px] px-4 text-[15px] font-bold text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-pink/20 transition-all"
                  placeholder="e.g. DRAFT, CONFIDENTIAL"
                />
              </div>
              
              <button 
                onClick={addWatermark}
                disabled={isProcessing}
                className="w-full h-[52px] bg-brand-pink text-white rounded-[12px] font-bold text-[15px] shadow-lg shadow-brand-pink/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-2"
              >
                {isProcessing ? 'Stamping pages...' : 'Watermark PDF Now'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TOOL GUIDE SECTION */}
      <ToolGuide 
        toolName="Watermark PDF"
        description="Protect your documents by adding a custom text watermark. Discourage unauthorized copying and maintain brand clarity."
        steps={[
          "Select the PDF file you want to protect.",
          "Type your watermark text (e.g., 'CONFIDENTIAL').",
          "Apply the watermark to all pages of the document.",
          "Download your protected PDF file securely."
        ]}
        useCases={[
          "Marking internal company drafts as 'Draft'.",
          "Protecting intellectual property with 'Copyright'.",
          "Adding 'Confidential' to sensitive legal papers.",
          "Branding documents for client presentations."
        ]}
        example={{
          input: "Contract_v1.pdf",
          output: "Contract_v1_Watermarked.pdf"
        }}
        seoContent="Watermark PDF online free with FileMint, the easiest way to add security to your files. Learn how to watermark PDF without losing quality using our high-performance on-device tools. Our secure watermark PDF tool ensures your data never leaves your browser, giving you a fast watermark PDF on mobile experience. Perfect for professional document protection."
        faqs={[
          { q: "Is the watermark removable?", a: "The watermark is flattened into the PDF making it difficult to remove without specialized tools." },
          { q: "Can I choose the color?", a: "The watermark uses a professional semi-transparent gray to ensure readability while protecting content." },
          { q: "Does it apply to every page?", a: "Yes, our tool automatically places the watermark in the center of every single page." }
        ]}
      />
    </div>
  );
};
