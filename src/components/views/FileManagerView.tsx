import React, { useState } from 'react';
import { Trash2, Download, Archive, File as FileIcon, Image as ImageIcon, FileText as FilePdfIcon, Eye, X, Share2, FolderOpen } from 'lucide-react';
import { useFileManager } from '../../hooks/useFileManager';
import { FileItem } from '../../types';
import { ToolGuide } from '../ui/ToolGuide';

export const FileManagerView: React.FC = () => {
  const { files, deleteFile, clearAllFiles, getFileData } = useFileManager();
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FilePdfIcon className="w-5 h-5 text-brand-pink" strokeWidth={2} />;
    if (type.includes('image')) return <ImageIcon className="w-5 h-5 text-brand-pink" strokeWidth={2} />;
    if (type.includes('zip')) return <Archive className="w-5 h-5 text-brand-pink" strokeWidth={2} />;
    return <FileIcon className="w-5 h-5 text-[#6B7280]" strokeWidth={2} />;
  };

  const handleDownload = async (file: FileItem) => {
    const data = await getFileData(file.id);
    if (!data) return;
    
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleShare = async (file: FileItem) => {
    const data = await getFileData(file.id);
    if (!data) return;
    
    try {
      const shareFile = new File([data], file.name, { type: file.type });
      if (navigator.canShare && navigator.canShare({ files: [shareFile] })) {
        await navigator.share({
          files: [shareFile],
          title: file.name,
          text: `Checkout this file: ${file.name}`
        });
      } else {
        alert("Sharing not supported on this device/browser.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleView = async (file: FileItem) => {
    const data = await getFileData(file.id);
    if (!data) return;
    
    const url = URL.createObjectURL(data);
    setPreviewUrl(url);
    setSelectedFile(file);
  };

  const closePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  return (
    <div className="flex flex-col p-4 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-400 bg-bg-base dark:bg-slate-950">
      
      <div className="px-1 mt-2 flex flex-col items-start">
        <div className="w-12 h-12 rounded-[14px] bg-brand-light dark:bg-brand-pink/10 flex items-center justify-center text-brand-pink mb-4 shadow-sm border border-brand-pink/5">
          <FolderOpen size={22} />
        </div>
        <h1 className="text-[24px] font-bold text-brand-gradient font-display tracking-tight leading-none">Files & Vault</h1>
        <p className="text-[#6B7280] dark:text-gray-500 font-medium text-[13px] mt-1.5">Quickly access and download your results.</p>
      </div>

      <div className="flex items-center justify-between px-1">
        <h2 className="text-[12px] font-bold text-[#6B7280] dark:text-gray-500 uppercase tracking-wider">Processed Items ({files.length})</h2>
        {files.length > 0 && (
          <button 
            onClick={clearAllFiles}
            className="text-[12px] font-bold text-brand-pink hover:bg-brand-light px-3 py-1 rounded-full transition-all"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {files.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-[20px] p-12 text-center flex flex-col items-center shadow-sm border border-[#E5E7EB] dark:border-slate-700">
            <div className="w-16 h-16 bg-brand-light dark:bg-brand-pink/10 rounded-[20px] flex items-center justify-center mb-4 text-brand-pink/40">
              <FileIcon size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-[17px] font-bold text-[#111827] dark:text-gray-100 mb-1">Vault is empty</h3>
            <p className="text-[13px] text-[#6B7280] dark:text-gray-500 max-w-[200px] font-medium leading-relaxed">Files you process will appear here for download.</p>
          </div>
        ) : (
          files.map((file) => (
            <div 
              key={file.id}
              className="bg-white dark:bg-slate-800 p-4 rounded-[20px] border border-[#E5E7EB] dark:border-slate-700 shadow-sm flex items-center gap-4 transition-all duration-300 ease-out hover:border-brand-pink/20"
            >
              <div className="w-12 h-12 bg-brand-light dark:bg-brand-pink/10 rounded-[14px] flex items-center justify-center flex-shrink-0">
                {getFileIcon(file.type)}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h4 className="text-[14px] font-bold text-[#111827] dark:text-gray-100 truncate">{file.name}</h4>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#6B7280]">
                  <span className="truncate max-w-[80px]">{file.toolName}</span>
                  <span className="w-0.5 h-0.5 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                  <span>{formatSize(file.size)}</span>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {(file.type.includes('image') || file.type.includes('pdf') || file.type.includes('text')) && (
                  <button 
                    onClick={() => handleView(file)}
                    className="p-2.5 text-[#6B7280] hover:text-brand-pink hover:bg-brand-light/50 rounded-full transition-all"
                  >
                    <Eye size={18} strokeWidth={2} />
                  </button>
                )}
                <button 
                  onClick={() => handleDownload(file)}
                  className="p-2.5 text-[#6B7280] hover:text-brand-pink hover:bg-brand-light/50 rounded-full transition-all"
                >
                  <Download size={18} strokeWidth={2} />
                </button>
                <button 
                  onClick={() => deleteFile(file.id)}
                  className="p-2.5 text-[#6B7280] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all"
                >
                  <Trash2 size={18} strokeWidth={2} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {previewUrl && selectedFile && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col animate-in fade-in duration-300">
          <div className="flex items-center justify-between p-5 text-white">
            <div className="flex flex-col min-w-0">
              <h3 className="font-bold truncate text-[15px]">{selectedFile.name}</h3>
              <p className="text-[11px] text-gray-400 opacity-80">{formatSize(selectedFile.size)}</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleDownload(selectedFile)}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all"
              >
                <Download size={20} />
              </button>
              <button 
                onClick={closePreview}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all font-bold"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
            {selectedFile.type.includes('image') ? (
              <img src={previewUrl} alt={selectedFile.name} className="max-w-full max-h-full object-contain shadow-2xl rounded-lg" />
            ) : (
              <iframe src={previewUrl} className="w-full h-full rounded-2xl bg-white shadow-2xl border-none" title={selectedFile.name} />
            )}
          </div>
        </div>
      )}

      {/* TOOL GUIDE SECTION */}
      <ToolGuide 
        toolName="File Manager"
        description="Access and manage all your processed files in one secure vault. Every file stays private and never leaves your browser."
        steps={[
          "Browse your recent processed documents.",
          "Tap the 'Eye' icon to preview your results.",
          "Tap 'Download' to save the file permanently.",
          "Use 'Clear All' to wipe your session history instantly."
        ]}
        useCases={[
          "Downloading multiple merged PDFs at once.",
          "Checking the final look of compressed images.",
          "Wiping sensitive data after a public computer session.",
          "Sharing processed results via mobile menu."
        ]}
        example={{
          input: "Session with 5 tools used",
          output: "5 items in vault ready for download"
        }}
        seoContent="File manager online free with FileMint, the private way to handle your session data. Our secure file manager tool uses local storage to keep your history safe, making it a reliable file manager on mobile browsers. Experience a fast file manager that keeps your results organized without needing a server account. Your files, your privacy, zero cost."
        faqs={[
          { q: "Are my files stored online?", a: "No, everything is stored locally on your device's browser memory." },
          { q: "How long do files stay in the vault?", a: "They stay until you close your browser tab or manually clear them." },
          { q: "Can I rename files here?", a: "Currently, you can preview, download, and delete. Renaming is best done after downloading." }
        ]}
      />
    </div>
  );
};
