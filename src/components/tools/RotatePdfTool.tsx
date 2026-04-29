import React, { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { FileUploader } from '../ui/FileUploader';
import { MdInsertDriveFile, MdRotateRight, MdDownload, MdRefresh } from 'react-icons/md';
import { useFileManager } from '../../hooks/useFileManager';
import { ToolGuide } from '../ui/ToolGuide';

export const RotatePdfTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState('');
  const [rotation, setRotation] = useState<number>(90);
  const { saveFile } = useFileManager();

  const handleFiles = async (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setOutputUrl(null);
    }
  };

  const rotatePDF = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      pages.forEach(page => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + rotation));
      });
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const fileName = `FileMint_Rotated_${file.name}`;
      
      setOutputUrl(url);
      setResultFileName(fileName);

      saveFile({
        name: fileName,
        toolName: 'Rotate PDF',
        type: `application/pdf`,
        size: blob?.size || 0
      }, blob);
    } catch (e) {
      console.error(e);
      alert('Error rotating PDF.');
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
            <MdRotateRight size={32} />
          </div>
          <h3 className="text-[18px] font-bold text-[#111827] dark:text-gray-100 mb-1 font-display tracking-tight">PDF Rotated!</h3>
          <p className="text-[13px] text-[#6B7280] dark:text-gray-400 mb-8 font-medium">All pages have been adjusted by {rotation}°.</p>
          
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
              Rotate Another
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
                  <p className="text-[12px] font-medium text-[#6B7280]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button onClick={() => setFile(null)} className="text-[12px] font-bold text-brand-pink hover:bg-brand-light px-3 py-1.5 rounded-lg transition-all">Replace</button>
              </div>
              
              <div>
                <label className="text-[14px] font-bold text-[#111827] dark:text-gray-200 mb-3 block px-1">Rotation Angle</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { label: '90° Right', value: 90 },
                    { label: '90° Left', value: -90 },
                    { label: '180° Flip', value: 180 }
                  ].map((opt) => (
                    <button 
                      key={opt.value}
                      onClick={() => setRotation(opt.value)} 
                      className={`h-[48px] rounded-[12px] font-bold transition-all text-[13px] border ${
                        rotation === opt.value 
                        ? 'bg-brand-pink text-white border-brand-pink shadow-md shadow-brand-pink/20 scale-[1.02]' 
                        : 'bg-[#F8F9FC] dark:bg-slate-900 text-[#6B7280] dark:text-gray-400 border-[#E5E7EB] dark:border-slate-800'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={rotatePDF}
                disabled={isProcessing}
                className="w-full h-[52px] bg-brand-pink text-white rounded-[12px] font-bold text-[15px] shadow-lg shadow-brand-pink/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-2"
              >
                {isProcessing ? 'Aligning pages...' : 'Rotate PDF Now'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TOOL GUIDE SECTION */}
      <ToolGuide 
        toolName="Rotate PDF"
        description="Permanently fix the orientation of your PDF pages. Rotate clockwise, counter-clockwise, or 180 degrees in one click."
        steps={[
          "Select the PDF file that needs an orientation fix.",
          "Choose the rotation angle (90° Left, 90° Right, or 180°).",
          "Apply the rotation to update all pages in the file.",
          "Download the correctly oriented PDF to your device."
        ]}
        useCases={[
          "Correcting sideways scans from document cameras.",
          "Fixing orientation of exam sheets and assignments.",
          "Ensuring professional presentation of digital documents.",
          "Rotating landscape pages for easier reading."
        ]}
        example={{
          input: "Side_Scan.pdf (Upside down)",
          output: "Correct_Doc.pdf (Right side up)"
        }}
        seoContent="Rotate PDF online free and fix document alignment in seconds with FileMint. This is the best rotate PDF without losing quality tool, optimized for fast rotate PDF on mobile browsers. Our secure rotate PDF tool works locally, so your private documents never touch our servers. A simple and completely free rotate tool for everyone."
        faqs={[
          { q: "Does it rotate all pages?", a: "Yes, currently it applies the rotation to every page in the document." },
          { q: "Is the quality affected?", a: "No, rotation is a lossless metadata operation; your PDF quality remains identical." },
          { q: "Can I rotate multiple times?", a: "Yes, you can rotate 90 degrees multiple times until it looks perfect." }
        ]}
      />
    </div>
  );
};
