import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileUploader } from '../ui/FileUploader';
import { MdInsertDriveFile, MdContentCut, MdDownload, MdRefresh } from 'react-icons/md';
import { useFileManager } from '../../hooks/useFileManager';
import { ToolGuide } from '../ui/ToolGuide';

export const SplitPdfTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState('');
  const [pageRange, setPageRange] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(0);
  const { saveFile } = useFileManager();

  const handleFiles = async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setOutputUrl(null);
      // Get total pages
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        setTotalPages(pdf.getPageCount());
      } catch (e) {
        console.error(e);
      }
    }
  };

  const splitPDF = async () => {
    if (!file || !pageRange) return;
    setIsProcessing(true);
    
    try {
      // Parse page range e.g. "1-3" or "1,3,4"
      const indicesToKeep = new Set<number>();
      const parts = pageRange.split(',');
      for (const part of parts) {
        if (part.includes('-')) {
          const [startStr, endStr] = part.split('-');
          const start = parseInt(startStr.trim());
          const end = parseInt(endStr.trim());
          if (!isNaN(start) && !isNaN(end) && start > 0 && end >= start) {
            for (let i = start; i <= end; i++) {
              indicesToKeep.add(i - 1); // 0-indexed
            }
          }
        } else {
          const page = parseInt(part.trim());
          if (!isNaN(page) && page > 0) {
            indicesToKeep.add(page - 1);
          }
        }
      }

      const indicesArray = Array.from(indicesToKeep).filter(i => i >= 0 && i < totalPages).sort((a,b) => a - b);
      
      if (indicesArray.length === 0) {
        alert('Invalid page range. Please use format like 1-3 or 2,4,5');
        setIsProcessing(false);
        return;
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdf, indicesArray);
      copiedPages.forEach((page) => newPdf.addPage(page));
      
      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const fileName = `FileMint_Split_${Date.now()}.pdf`;
      
      setResultFileName(fileName);
      setOutputUrl(url);

      saveFile({
        name: fileName,
        toolName: 'Split PDF',
        type: `application/pdf`,
        size: blob?.size || 0
      }, blob);
    } catch (e) {
      console.error(e);
      alert('Error splitting PDF.');
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
            <MdContentCut size={32} />
          </div>
          <h3 className="text-[18px] font-bold text-[#111827] dark:text-gray-100 mb-1 font-display tracking-tight">Split Complete!</h3>
          <p className="text-[13px] text-[#6B7280] dark:text-gray-400 mb-8 font-medium">Your extracted pages are ready.</p>
          
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={handleDownload}
              className="w-full h-[48px] bg-brand-pink text-white rounded-[12px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-pink/20 active:scale-95 transition-all"
            >
              <MdDownload size={20} /> Download PDF
            </button>
            <button 
              onClick={() => { setFile(null); setOutputUrl(null); setPageRange(''); }}
              className="w-full h-[48px] bg-brand-light text-brand-pink rounded-[12px] font-bold active:scale-95 transition-all text-[14px]"
            >
              Split Another
            </button>
          </div>
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
                  <p className="text-[12px] font-medium text-[#6B7280]">{(file.size / 1024 / 1024).toFixed(2)} MB • {totalPages} Pages</p>
                </div>
                <button onClick={() => setFile(null)} className="text-[12px] font-bold text-brand-pink hover:bg-brand-light px-3 py-1.5 rounded-lg transition-all">Replace</button>
              </div>
              
              <div className="px-1">
                <label className="text-[14px] font-bold text-[#111827] dark:text-gray-200 mb-3 block">Pages to Extract</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="e.g. 1-3, 5, 8" 
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    className="w-full bg-[#F8F9FC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 text-[#111827] dark:text-gray-100 rounded-[12px] h-[48px] px-4 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 transition-all text-[15px]"
                  />
                </div>
                <p className="text-[11px] text-[#6B7280] mt-3 font-medium flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-brand-pink/30" />
                  Format: 1-3 (range) or 1,3,5 (separate).
                </p>
              </div>
              
              <button 
                onClick={splitPDF}
                disabled={!pageRange || isProcessing}
                className="w-full h-[52px] bg-brand-pink text-white rounded-[12px] font-bold text-[15px] shadow-lg shadow-brand-pink/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-2"
              >
                {isProcessing ? 'Processing files...' : 'Split PDF Now'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TOOL GUIDE SECTION */}
      <ToolGuide 
        toolName="Split PDF"
        description="Separate individual pages or extract specific page ranges from your PDF instantly. Precision splitting in seconds."
        steps={[
          "Select the PDF document you want to split.",
          "Enter your required page ranges (e.g., 1-3, 5, 8).",
          "Proceed with the split to extract your chosen pages.",
          "Clear the output and download your new PDF documents."
        ]}
        useCases={[
          "Extracting single pages from book scans.",
          "Sharing only specific sections of a large contract.",
          "Splitting multi-page invoices into separate files.",
          "Removing unwanted blank pages from reports."
        ]}
        example={{
          input: "Manual_Vol_1.pdf (Pages 1-10)",
          output: "Manual_Summary.pdf (Pages 1-3)"
        }}
        seoContent="Split PDF online free using our high-precision extraction tool. FileMint provides the best way to Split PDF without losing quality, working perfectly on mobile devices. Our secure Split PDF tool ensures your documents stay private by processing everything locally. Experience a fast Split PDF tool that handles complex page ranges effortlessly."
        faqs={[
          { q: "Can I extract specific pages?", a: "Yes, you can enter comma-separated numbers like 1, 4, 7 or ranges like 1-5." },
          { q: "Does splitting reduce quality?", a: "No, the original quality of your PDF pages is preserved perfectly." },
          { q: "Is there a page limit?", a: "There are no hard limits, but very large files may take longer to process on mobile." }
        ]}
      />
    </div>
  );
};
