import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileUploader } from '../ui/FileUploader';
import { MdInsertDriveFile, MdDelete, MdArrowDownward, MdArrowUpward } from 'react-icons/md';
import { useFileManager } from '../../hooks/useFileManager';
import { ToolGuide } from '../ui/ToolGuide';
import { RatingPrompt } from '../ui/RatingPrompt';

export const MergePdfTool: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState('');
  const { saveFile } = useFileManager();

  const handleFiles = (selectedFiles: File[]) => {
    setFiles(prev => [...prev, ...selectedFiles]);
    setOutputUrl(null);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setOutputUrl(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index - 1];
    newFiles[index - 1] = temp;
    setFiles(newFiles);
    setOutputUrl(null);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index + 1];
    newFiles[index + 1] = temp;
    setFiles(newFiles);
    setOutputUrl(null);
  };

  const mergePDFs = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const fileName = `FileMint_MergePDF_${Date.now()}.pdf`;
      
      setResultFileName(fileName);
      setOutputUrl(url);
      
      saveFile({
        name: fileName,
        toolName: 'Merge PDF',
        type: `application/pdf`,
        size: blob?.size || 0
      }, blob);
    } catch (e) {
      console.error(e);
      alert('Error merging PDFs.');
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
        <div className="flex flex-col items-center justify-center py-4 animate-in zoom-in-95 duration-300 text-center">
          <div className="w-[64px] h-[64px] rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
            <MdInsertDriveFile size={32} />
          </div>
          <h3 className="text-[18px] font-bold text-[#111827] dark:text-gray-100 mb-1 font-display">Merge Complete!</h3>
          <p className="text-[13px] text-[#6B7280] dark:text-gray-400 mb-8 font-medium">Your PDFs have been combined successfully.</p>
          
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={handleDownload}
              className="w-full h-[48px] bg-brand-pink text-white rounded-[12px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-pink/20 active:scale-95 transition-all"
            >
              <MdInsertDriveFile size={20} /> Download Merged PDF
            </button>
            <button 
              onClick={() => { setFiles([]); setOutputUrl(null); }}
              className="w-full h-[48px] bg-brand-light text-brand-pink rounded-[12px] font-bold active:scale-95 transition-all text-[14px]"
            >
              Merge More Files
            </button>
          </div>
          
          {RatingPrompt && <div className="w-full mt-8"><RatingPrompt /></div>}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <FileUploader 
            accept="application/pdf" 
            multiple={true} 
            onFilesSelected={handleFiles} 
            label="Select PDF files"
            subLabel="Tap to upload or add files"
          />
          
          {files.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                 <h4 className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">Files ({files.length})</h4>
                 <button onClick={() => setFiles([])} className="text-[12px] font-bold text-brand-pink hover:bg-brand-light px-2 py-1 rounded-md transition-all">Clear All</button>
              </div>
              
              <div className="flex flex-col gap-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#F8F9FC] dark:bg-slate-900/50 p-3 rounded-[12px] border border-[#E5E7EB] dark:border-slate-800">
                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                      <div className="w-[36px] h-[36px] bg-brand-light text-brand-pink rounded-lg flex items-center justify-center flex-shrink-0">
                        <MdInsertDriveFile size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-bold text-[#111827] dark:text-gray-100 truncate">{file.name}</p>
                        <p className="text-[11px] font-medium text-[#6B7280]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        <button onClick={() => moveUp(i)} disabled={i === 0} className="p-1.5 text-[#6B7280] hover:text-brand-pink disabled:opacity-20">
                          <MdArrowUpward size={18} />
                        </button>
                        <button onClick={() => moveDown(i)} disabled={i === files.length - 1} className="p-1.5 text-[#6B7280] hover:text-brand-pink disabled:opacity-20">
                          <MdArrowDownward size={18} />
                        </button>
                      </div>
                      <button onClick={() => removeFile(i)} className="p-2 text-[#6B7280] hover:text-red-500">
                        <MdDelete size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col gap-3 mt-2">
                <button 
                   onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                   className="w-full h-[48px] bg-white border-2 border-[#E5E7EB] dark:border-slate-700 text-[#111827] dark:text-white rounded-[12px] font-bold text-[14px] active:scale-[0.98] transition-all flex justify-center items-center gap-2"
                >
                  + Add More Files
                </button>

                <button 
                  onClick={mergePDFs}
                  disabled={files.length < 2 || isProcessing}
                  className="w-full h-[52px] bg-brand-pink text-white rounded-[12px] font-bold text-[15px] shadow-lg shadow-brand-pink/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-2"
                >
                  {isProcessing ? 'Combining documents...' : 'Merge PDF Now'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL GUIDE SECTION */}
      <ToolGuide 
        toolName="Merge PDF"
        description="Combine multiple PDF documents into a single professional file instantly. High-quality merging without any file limits."
        steps={[
          "Select the PDF files you want to combine from your device.",
          "Reorder the files by dragging them into your preferred sequence.",
          "Click 'Merge PDF Now' to trigger the secure local processing.",
          "Download your newly combined PDF document immediately."
        ]}
        useCases={[
          "Combining multi-part student assignments.",
          "Merging monthly receipts into one expense report.",
          "Joining separate chapters into a complete ebook.",
          "Organizing medical records for easy archival."
        ]}
        example={{
          input: "Report_Part1.pdf + Report_Part2.pdf",
          output: "Full_Project_Report.pdf"
        }}
        seoContent="Merge PDF online free with FileMint, the fastest way to join documents without losing quality. Our tool ensures a fast Merge PDF experience on mobile or desktop. Since all processing happens in your browser, it is a secure Merge PDF tool that keeps your sensitive information private. No registration is required to use this simple PDF joiner."
        faqs={[
          { q: "Is it free to merge multiple PDFs?", a: "Yes, FileMint allows you to combine as many PDFs as you need for free." },
          { q: "Is my data safe while merging?", a: "Absolutely. We use local processing, meaning your files never leave your device." },
          { q: "Can I reorder files before merging?", a: "Yes, you can easily remove or add more files before hitting the merge button." }
        ]}
      />
    </div>
  );
};
