import React, { useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { MdTextFormat, MdDownload, MdRefresh } from 'react-icons/md';
import { useFileManager } from '../../hooks/useFileManager';
import { ToolGuide } from '../ui/ToolGuide';

export const TextPdfTool: React.FC = () => {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState('');
  const { saveFile } = useFileManager();

  const generatePDF = async () => {
    if (!text.trim()) return;
    setIsProcessing(true);
    
    try {
      const pdfDoc = await PDFDocument.create();
      let page = pdfDoc.addPage();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      const { width, height } = page.getSize();
      const fontSize = 12;
      const margin = 50;
      let y = height - margin;
      
      const textLines = text.split('\n');
      
      for (const line of textLines) {
        // Very basic simple text wrapping could go here, but for simplicity we rely on manual newlines or truncation
        // In a real app we'd compute layout text widths
        const words = line.split(' ');
        let currentLine = '';
        
        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const textWidth = font.widthOfTextAtSize(testLine, fontSize);
          
          if (textWidth > width - margin * 2 && currentLine !== '') {
            page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
            y -= fontSize + 6;
            currentLine = word;
            
            if (y < margin) {
              page = pdfDoc.addPage();
              y = height - margin;
            }
          } else {
            currentLine = testLine;
          }
        }
        
        page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
        y -= fontSize + 6;
        
        if (y < margin) {
          page = pdfDoc.addPage();
          y = height - margin;
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const fileName = `FileMint_Text_${Date.now()}.pdf`;
      
      setOutputUrl(url);
      setResultFileName(fileName);

      saveFile({
        name: fileName,
        toolName: 'Text to PDF',
        type: `application/pdf`,
        size: blob?.size || 0
      }, blob);
    } catch (e) {
      console.error(e);
      alert('Error creating PDF.');
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
            <MdTextFormat size={32} />
          </div>
          <h3 className="text-[18px] font-bold text-[#111827] dark:text-gray-100 mb-1 font-display tracking-tight">PDF Generated!</h3>
          <p className="text-[13px] text-[#6B7280] dark:text-gray-400 mb-8 font-medium">Your text has been converted to a document.</p>
          
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={handleDownload}
              className="w-full h-[48px] bg-brand-pink text-white rounded-[12px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-pink/20 active:scale-95 transition-all"
            >
              <MdDownload size={20} /> Download PDF
            </button>
            <button 
              onClick={() => { setText(''); setOutputUrl(null); }}
              className="w-full h-[48px] bg-brand-light text-brand-pink rounded-[12px] font-bold active:scale-95 transition-all text-[14px]"
            >
              Start New
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-2 duration-300">
          <div>
            <label className="text-[14px] font-bold text-[#111827] dark:text-gray-200 mb-3 block px-1">Enter Your Text</label>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here to create a PDF..."
              className="w-full h-[240px] bg-[#F8F9FC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-[12px] p-4 text-[15px] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-pink/20 transition-all resize-none shadow-inner"
            ></textarea>
          </div>
          
          <button 
            onClick={generatePDF}
            disabled={!text.trim() || isProcessing}
            className="w-full h-[52px] bg-brand-pink text-white rounded-[12px] font-bold text-[15px] shadow-lg shadow-brand-pink/20 disabled:opacity-50 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
          >
            {isProcessing ? 'Generating PDF...' : 'Convert to PDF Now'}
          </button>
        </div>
      )}

      {/* TOOL GUIDE SECTION */}
      <ToolGuide 
        toolName="Text to PDF"
        description="Convert plain text or notes into a clean, professional PDF file instantly. No complex editors needed."
        steps={[
          "Type or paste your text into the input field.",
          "Check the word count and formatting.",
          "Convert your text into a PDF document.",
          "Download the generated PDF to your device."
        ]}
        useCases={[
          "Creating quick documents from mobile notes.",
          "Formatting basic text and lists as official PDFs.",
          "Exporting plain text messages for archiving.",
          "Generating simple essays or assignment drafts."
        ]}
        example={{
          input: "Meeting Notes: 1. Goal 2. Roadmap",
          output: "Meeting_Notes.pdf"
        }}
        seoContent="Text to PDF online free with FileMint, the simplest text conversion tool on the web. Create your own PDF document with ease and enjoy a fast text to PDF on mobile experience. Our secure text to PDF tool processes your text locally, ensuring your notes remain private. A clean, lightweight, and completely free solution for document creation."
        faqs={[
          { q: "Can I add images?", a: "Currently, this tool is optimized for plain text conversion only." },
          { q: "Is there a limit on text length?", a: "You can convert several pages worth of text without any issues." },
          { q: "Can I choose fonts?", a: "The tool automatically generates a standard professional serif font for maximum readability." }
        ]}
      />
    </div>
  );
};
