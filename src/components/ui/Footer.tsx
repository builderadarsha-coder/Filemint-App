import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MdClose } from 'react-icons/md';

export const Footer: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<'privacy' | 'terms' | 'disclaimer' | null>(null);

  const legalContent = {
    privacy: {
      title: 'Privacy Policy',
      content: 'Your privacy is important to us. FileMint processes all files locally on your device. We do not upload, store, or share your personal data or files with any external servers. Any data processed remains in your browser session and is deleted when you close the app or clear your history.'
    },
    terms: {
      title: 'Terms & Conditions',
      content: 'By using FileMint, you agree that the service is provided "as is" without any warranties. We are not responsible for any data loss or issues arising from the use of our local file processing tools. You retain all rights to your content.'
    },
    disclaimer: {
      title: 'Disclaimer',
      content: 'FileMint is a client-side utility tool. While we use industry-standard libraries for file processing, results may vary. Always keep backups of your original files. We are not affiliated with any third-party services mentioned unless explicitly stated.'
    }
  };

  return (
    <footer className="mt-8 pt-6 pb-0 border-t border-gray-100 dark:border-slate-800 flex flex-col items-center gap-3 animate-in fade-in duration-700">
      <div className="flex flex-col items-center text-center">
        <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium tracking-tight">
          Your files stay on your device. No upload.
        </p>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-x-2 text-[12px] font-bold text-brand-pink">
        <button onClick={() => setActiveLayer('privacy')} className="hover:text-brand-orange transition-colors active:scale-95">Privacy Policy</button>
        <span className="text-[#E5E7EB] dark:text-slate-800 font-normal">·</span>
        <button onClick={() => setActiveLayer('terms')} className="hover:text-brand-orange transition-colors active:scale-95">Terms & Conditions</button>
        <span className="text-[#E5E7EB] dark:text-slate-800 font-normal">·</span>
        <button onClick={() => setActiveLayer('disclaimer')} className="hover:text-brand-orange transition-colors active:scale-95">Disclaimer</button>
      </div>

      <div className="flex flex-col items-center mt-1">
        <span className="text-[11px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
          FileMint v1.1
        </span>
      </div>

      {/* LEGAL MODAL */}
      <AnimatePresence>
        {activeLayer && (
          <div className="fixed inset-0 z-[200] flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLayer(null)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[32px] p-6 pb-12 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[18px] font-bold text-gray-900 dark:text-white">
                  {legalContent[activeLayer].title}
                </h3>
                <button 
                  onClick={() => setActiveLayer(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500"
                >
                  <MdClose size={20} />
                </button>
              </div>
              <div className="prose prose-sm dark:prose-invert">
                <p className="text-[14px] leading-relaxed text-gray-600 dark:text-gray-400">
                  {legalContent[activeLayer].content}
                </p>
              </div>
              <button 
                onClick={() => setActiveLayer(null)}
                className="w-full mt-8 py-3.5 bg-gray-900 dark:bg-slate-800 text-white rounded-2xl font-bold text-[15px] active:scale-[0.98] transition-all"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};
