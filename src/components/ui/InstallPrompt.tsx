import React, { useState, useEffect } from 'react';
import { MdClose, MdInstallMobile } from 'react-icons/md';
import { usePWA } from '../../hooks/usePWA';

export const InstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, installPWA } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    // Check if user previously dismissed
    const dismissed = localStorage.getItem('installDismissed') === 'true';
    setHasDismissed(dismissed);

    // Show after delay if installable and not dismissed
    if (isInstallable && !isInstalled && !dismissed) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowPrompt(false);
    }
  }, [isInstallable, isInstalled]);

  const handleDismiss = () => {
    setShowPrompt(false);
    setHasDismissed(true);
    localStorage.setItem('installDismissed', 'true');
  };

  const handleInstall = async () => {
    await installPWA();
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-[96px] left-4 right-4 z-50 animate-in slide-in-from-bottom-8 fade-in duration-500 ease-out">
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-[16px] rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white dark:border-slate-700/60 p-4 pr-10 relative overflow-hidden flex items-center gap-4">
        {/* Close Button */}
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full bg-gray-100/50 dark:bg-slate-700/50 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors z-10"
        >
          <MdClose className="w-[18px] h-[18px]" />
        </button>

        {/* Icon */}
        <div className="w-[48px] h-[48px] rounded-full bg-gradient-to-br from-[#FF2D8D] to-[#FF8A3D] flex items-center justify-center text-white flex-shrink-0 shadow-sm relative z-10">
          <MdInstallMobile className="w-[24px] h-[24px]" />
        </div>

        {/* Content */}
        <div className="flex-1 relative z-10 py-1">
          <h3 className="text-[16px] font-bold text-gray-900 dark:text-white leading-tight mb-0.5">Install FileMint</h3>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium mb-3">Launch like a native app</p>
          
          <button 
            onClick={handleInstall}
            className="w-full bg-gradient-to-r from-[#FF2D8D] to-[#FF8A3D] text-white font-bold py-2 px-4 rounded-[12px] text-[14px] shadow-sm hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Install Now
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FF2D8D]/10 rounded-full blur-2xl pointer-events-none" />
      </div>
    </div>
  );
};
