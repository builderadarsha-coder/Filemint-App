import React, { useState, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { MdDraw, MdTextFields, MdUndo, MdClear, MdCheck, MdStars, MdInfo, MdFileDownload, MdAspectRatio, MdLock } from 'react-icons/md';
import { useFileManager } from '../../hooks/useFileManager';
import { ToolGuide } from '../ui/ToolGuide';

type TabMode = 'draw' | 'type';

function trimCanvas(c: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  const copy = document.createElement('canvas').getContext('2d');
  if (!copy) return c;

  const pixels = ctx.getImageData(0, 0, c.width, c.height);
  const l = pixels.data.length;
  let bound = { top: -1, left: -1, right: -1, bottom: -1 };
  let x, y;

  for (let i = 0; i < l; i += 4) {
    if (pixels.data[i + 3] !== 0) {
      x = (i / 4) % c.width;
      y = Math.floor((i / 4) / c.width);

      if (bound.top === -1) bound.top = y;
      if (bound.left === -1) bound.left = x;
      else if (x < bound.left) bound.left = x;

      if (bound.right === -1) bound.right = x;
      else if (bound.right < x) bound.right = x;

      if (bound.bottom === -1) bound.bottom = y;
      else if (bound.bottom < y) bound.bottom = y;
    }
  }

  if (bound.top === -1) return c;

  const padding = 20;
  const trimHeight = bound.bottom - bound.top + padding * 2;
  const trimWidth = bound.right - bound.left + padding * 2;
  const trimmed = copy.canvas;

  trimmed.width = trimWidth;
  trimmed.height = trimHeight;
  copy.drawImage(c, bound.left - padding, bound.top - padding, trimWidth, trimHeight, 0, 0, trimWidth, trimHeight);

  return trimmed;
}

export const SignatureGenTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabMode>('type');
  
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2.5);
  
  const [typedText, setTypedText] = useState('');
  const [selectedFont, setSelectedFont] = useState('Dancing Script');
  const fonts = ['Caveat', 'Dancing Script', 'Great Vibes', 'Pacifico', 'Satisfy', 'Qwitcher Grypen', 'Marck Script'];

  const [resizeImageSource, setResizeImageSource] = useState<string | null>(null);
  const [resizeExamConfig, setResizeExamConfig] = useState('ssc');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const { saveFile } = useFileManager();

  useEffect(() => {
    if (activeTab === 'type' && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [activeTab]);

  const handleClear = () => sigCanvas.current?.clear();
  const handleUndo = () => {
    const data = sigCanvas.current?.toData();
    if (data && data.length > 0) {
      data.pop();
      sigCanvas.current?.fromData(data);
    }
  };

  const getSignatureDataUrl = async (): Promise<string | null> => {
    if (activeTab === 'draw') {
      if (sigCanvas.current?.isEmpty()) return null;
      return trimCanvas(sigCanvas.current!.getCanvas()).toDataURL('image/png');
    } else if (activeTab === 'type') {
      if (!typedText.trim()) return null;
      await document.fonts.ready;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 1000;
        canvas.height = 400;
        ctx.font = `80px "${selectedFont}"`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(typedText, 500, 200);
        return trimCanvas(canvas).toDataURL('image/png');
      }
    }
    return null;
  };

  const handleDownloadPng = async () => {
    setIsProcessing(true);
    try {
      const dataUrl = await getSignatureDataUrl();
      if (!dataUrl) return;
      const r = await fetch(dataUrl);
      const blob = await r.blob();
      const fileName = `FileMint_Signature_${Date.now()}.png`;
      
      saveFile({
        name: fileName,
        toolName: 'Signature Gen',
        type: 'image/png',
        size: blob.size
      }, blob);
      
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUseCreatedSignature = async () => {
    const dataUrl = await getSignatureDataUrl();
    if (dataUrl) {
      setResizeImageSource(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResizeImageSource(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleResizeSignature = async () => {
    if (!resizeImageSource) return;
    setIsProcessing(true);
    try {
      const canvas = document.createElement('canvas');
      let w = 140;
      let h = 60;
      if (resizeExamConfig === 'upsc') { w = 200; h = 100; }
      
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, w, h);

        const img = new Image();
        img.src = resizeImageSource;
        await new Promise((resolve) => { img.onload = resolve; });
        
        const scale = Math.min((w - 4) / img.width, (h - 4) / img.height);
        const iw = img.width * scale;
        const ih = img.height * scale;
        const x = (w - iw) / 2;
        const y = (h - ih) / 2;
        
        ctx.drawImage(img, x, y, iw, ih);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        const r = await fetch(dataUrl);
        const blob = await r.blob();
        const fileName = `FileMint_Resized_${resizeExamConfig.toUpperCase()}_${Date.now()}.jpg`;
        
        saveFile({
          name: fileName,
          toolName: 'Signature Gen',
          type: 'image/jpeg',
          size: blob.size
        }, blob);
        
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const colors = ['#000000', '#2563EB', '#DC2626', '#FF2D55', '#059669', '#4F46E5'];

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      
      {/* MAIN CARD */}
      <div className="flex flex-col gap-4">
        
        {/* MODE SWITCH: Segmented Control */}
        <div className="bg-[#F8F9FC] dark:bg-slate-900 p-1 rounded-full flex w-full">
          <button 
            onClick={() => setActiveTab('type')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-[13px] font-bold transition-all ${activeTab === 'type' ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20' : 'text-[#6B7280]'}`}
          >
            <MdTextFields size={18} /> TYPE
          </button>
          <button 
            onClick={() => setActiveTab('draw')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-[13px] font-bold transition-all ${activeTab === 'draw' ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20' : 'text-[#6B7280]'}`}
          >
            <MdDraw size={18} /> DRAW
          </button>
        </div>

        {/* TYPE MODE UI */}
        {activeTab === 'type' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            <div>
              <label className="text-[14px] font-bold text-[#111827] dark:text-gray-200 mb-2 block px-1">Your Name</label>
              <input 
                ref={nameInputRef}
                type="text" 
                value={typedText}
                onChange={e => setTypedText(e.target.value)}
                placeholder="Enter text to sign"
                className="w-full h-[52px] bg-[#F8F9FC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-[12px] px-4 text-[16px] font-bold text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-pink/20 transition-all"
              />
            </div>

            <div>
              <label className="text-[12px] font-bold text-[#6B7280] uppercase tracking-widest mb-3 block px-1 text-center">Style Browser</label>
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none snap-x px-1">
                {fonts.map(font => (
                  <button
                    key={font}
                    onClick={() => setSelectedFont(font)}
                    className={`flex-shrink-0 w-[110px] h-[70px] rounded-[14px] border-2 transition-all flex items-center justify-center relative snap-start ${selectedFont === font ? 'border-brand-pink bg-brand-light' : 'border-transparent bg-[#F8F9FC] dark:bg-slate-900/30'}`}
                  >
                    <span style={{ fontFamily: font }} className="text-[18px] text-[#111827] dark:text-white truncate px-2">Sign</span>
                    {selectedFont === font && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-pink rounded-full flex items-center justify-center text-white shadow-lg">
                        <MdCheck size={14} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[14px] font-bold text-[#111827] dark:text-gray-200 block px-1">Live Preview</label>
              <div className="bg-[#FFF7F9] dark:bg-slate-950 border-2 border-dashed border-brand-pink/20 rounded-[16px] h-[140px] flex items-center justify-center relative overflow-hidden p-4 group">
                 <span 
                   style={{ fontFamily: selectedFont, color, fontSize: '48px' }}
                   className="whitespace-nowrap transition-all drop-shadow-sm"
                 >
                   {typedText || 'Sign here'}
                 </span>
                 <div className="absolute bottom-2 right-2 flex items-center gap-2">
                    {colors.slice(0, 3).map(c => (
                      <button key={c} onClick={() => setColor(c)} className={`w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 ${color === c ? 'scale-125 shadow-md' : 'opacity-60'}`} style={{ backgroundColor: c }} />
                    ))}
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* DRAW MODE UI */}
        {activeTab === 'draw' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
             <div>
              <label className="text-[14px] font-bold text-[#111827] dark:text-gray-200 mb-2 block px-1">Signature Area</label>
              <div className="bg-[#F8F9FC] dark:bg-slate-900 border-2 border-dashed border-[#E5E7EB] dark:border-slate-800 rounded-[16px] h-[180px] overflow-hidden relative touch-none shadow-inner">
                  <SignatureCanvas 
                    ref={sigCanvas} 
                    penColor={color}
                    canvasProps={{ className: 'w-full h-full' }} 
                    minWidth={strokeWidth / 2}
                    maxWidth={strokeWidth * 1.5}
                    clearOnResize={false}
                  />
                  <div className="absolute top-3 left-3 pointer-events-none opacity-40">
                     <span className="text-[11px] font-bold text-[#6B7280]">DRAW BELOW</span>
                  </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 px-1">
               <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {colors.map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-[32px] h-[32px] rounded-full flex items-center justify-center transition-all ${color === c ? 'ring-2 ring-brand-pink ring-offset-2 dark:ring-offset-slate-800 scale-110 shadow-md' : 'scale-100 opacity-80'}`}
                      style={{ backgroundColor: c }}
                    >
                      {color === c && <MdCheck size={18} className="text-white" />}
                    </button>
                  ))}
               </div>
               <div className="flex items-center gap-4">
                  <button onClick={handleUndo} className="flex flex-col items-center gap-0.5 text-[11px] font-bold text-[#6B7280] active:text-brand-pink transition-all">
                    <MdUndo size={22} className="opacity-70" /> Undo
                  </button>
                  <button onClick={handleClear} className="flex flex-col items-center gap-0.5 text-[11px] font-bold text-[#6B7280] active:text-red-500 transition-all">
                    <MdClear size={22} className="opacity-70" /> Clear
                  </button>
               </div>
            </div>
          </div>
        )}

      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col gap-3 mt-2">
        <button 
           onClick={handleDownloadPng}
           disabled={isProcessing}
           className="w-full h-[52px] bg-brand-pink text-white rounded-[12px] font-bold text-[15px] shadow-lg shadow-brand-pink/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
           <MdFileDownload size={22} /> Download PNG
        </button>

        {!resizeImageSource ? (
           <button 
             onClick={handleUseCreatedSignature}
             className="w-full h-[48px] bg-brand-light text-brand-pink border border-brand-pink/10 rounded-[12px] font-bold text-[14px] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
           >
             <MdAspectRatio size={20} /> Resize for Govt Exams
           </button>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-[16px] p-4 shadow-xl border border-[#FFE4EA] dark:border-slate-800 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-[14px] font-bold text-[#111827] dark:text-white">Exam Resize Preview</h3>
               <button onClick={() => setResizeImageSource(null)} className="text-[#6B7280] hover:text-red-500 p-1"><MdClear size={20} /></button>
            </div>
            
            <div className="bg-[#F8F9FC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-xl h-[100px] flex items-center justify-center mb-4 overflow-hidden shadow-inner">
               <img src={resizeImageSource} className="max-w-[140px] max-h-[60px] object-contain drop-shadow-md" alt="To Resize" />
            </div>

            <div className="flex items-center gap-3 mb-5">
              <span className="text-[12px] font-bold text-[#6B7280] uppercase">Target:</span>
              <select 
                value={resizeExamConfig} 
                onChange={e => setResizeExamConfig(e.target.value)}
                className="flex-1 h-[40px] bg-[#F8F9FC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-[10px] px-3 text-[13px] font-bold text-[#111827] outline-none"
              >
                <option value="ssc">SSC / IBPS (140x60)</option>
                <option value="upsc">UPSC / NEET (200x100)</option>
              </select>
            </div>

            <button 
               onClick={handleResizeSignature}
               disabled={isProcessing}
               className="w-full h-[48px] bg-[#111827] dark:bg-white text-white dark:text-[#111827] rounded-[10px] font-bold text-[14px] active:scale-[0.98] transition-all"
            >
               {isProcessing ? 'Optimizing...' : 'Download Exam Ready JPEG'}
            </button>
          </div>
        )}
      </div>

      {/* TOOL GUIDE SECTION */}
      <ToolGuide 
        toolName="Signature Generator"
        description="Create clear, professional digital signatures for contracts and forms instantly. Draw by hand or type with elegant fonts."
        steps={[
          "Choose between 'Type' or 'Draw' mode.",
          "Type your name or draw using your touch screen/mouse.",
          "Select a professional color like Black or Blue.",
          "Download your transparent PNG signature instantly."
        ]}
        useCases={[
          "Signing digital employment contracts (PDF).",
          "Adding a personal touch to email sign-offs.",
          "Applying for exams or government portals online.",
          "Authorizing digital NDAs and legal documents."
        ]}
        example={{
          input: "Typed: 'John Doe' in cursive font",
          output: "John_Doe_Signature.png (Transparent)"
        }}
        seoContent="Signature generator online free with FileMint, the fastest way to sign documents digitally. Create your own signature without losing quality using the best signature generator on mobile. Our secure signature generator tool processes everything on your device, so your signature is never stored on our servers. 100% private and ready in seconds."
        faqs={[
          { q: "Is the signature transparent?", a: "Yes, we export signatures as transparent PNGs so they blend with any background." },
          { q: "Can I use this for legal docs?", a: "Most digital platforms accept these signatures, but check your local regulations for e-signatures." },
          { q: "Does it work on iPhone/Android?", a: "Yes, drawing works perfectly with your finger on any touch screen." }
        ]}
      />
    </div>
  );
};


