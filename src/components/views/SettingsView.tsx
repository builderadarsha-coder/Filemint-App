import React, { useState } from 'react';
import { 
  MdPerson, 
  MdEdit, 
  MdLogout, 
  MdDarkMode, 
  MdLightMode,
  MdDeleteSweep, 
  MdFavorite, 
  MdInfo, 
  MdDescription,
  MdChevronRight,
  MdInstallMobile,
  MdArrowBack,
  MdEmail,
  MdShield,
  MdGavel,
  MdHelpOutline,
  MdCreditCard
} from 'react-icons/md';
import { motion, AnimatePresence } from 'motion/react';
import { useSettings } from '../../hooks/useSettings';
import { usePWA } from '../../hooks/usePWA';
import { useFileManager } from '../../hooks/useFileManager';

export const SettingsView: React.FC = () => {
  const { userName, saveUserName, logout, isDarkMode, toggleDarkMode } = useSettings();
  const { isInstallable, isInstalled, installPWA } = usePWA();
  const { clearAllFiles } = useFileManager();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(userName || '');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [activeLegalPage, setActiveLegalPage] = useState<string | null>(null);

  const donationAmounts = [49, 99, 199];

  const handleSaveName = () => {
    if (editNameValue.trim()) {
      saveUserName(editNameValue.trim());
      setIsEditingName(false);
    }
  };

  const handleClearHistory = () => {
    clearAllFiles();
    setShowClearDialog(false);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto animate-in fade-in duration-500">
      
      {/* HEADER */}
      <header className="h-[64px] flex flex-col justify-center px-4 mb-4">
        <h1 className="text-[18px] font-semibold text-[#111827] dark:text-white">Settings</h1>
        <p className="text-[13px] text-[#6B7280]">Customize your experience</p>
      </header>

      <div className="px-4 space-y-5">
        
        {/* PROFILE SECTION */}
        <section className="bg-white dark:bg-slate-800 rounded-[14px] p-3.5 border border-[#E5E7EB] dark:border-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-[44px] h-[44px] rounded-full bg-[#FFE4EA] dark:bg-brand-pink/10 flex items-center justify-center text-[#FF2D55] overflow-hidden">
                {userName ? (
                  <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${userName}&backgroundColor=transparent`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <MdPerson size={24} />
                )}
              </div>
              <button 
                onClick={() => setIsEditingName(!isEditingName)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-white dark:bg-slate-700 border border-[#E5E7EB] dark:border-slate-600 rounded-full flex items-center justify-center text-[10px] shadow-sm"
              >
                ✏️
              </button>
            </div>
            <div className="flex-1 min-w-0">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={editNameValue} 
                    onChange={(e) => setEditNameValue(e.target.value)}
                    className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-[14px] font-bold text-[#111827] dark:text-white w-full max-w-[120px] focus:outline-none focus:ring-1 focus:ring-[#FF2D55]/20"
                    autoFocus
                  />
                  <button onClick={handleSaveName} className="text-[#FF2D55] font-bold text-[13px]">Save</button>
                </div>
              ) : (
                <>
                  <h2 className="text-[15px] font-bold text-[#111827] dark:text-white truncate">{userName || 'Guest User'}</h2>
                  <p className="text-[12px] text-[#6B7280]">{userName ? 'Signed in' : 'Local User'}</p>
                </>
              )}
            </div>
            <div className="flex gap-2">
              {!isEditingName && (
                 <button onClick={() => setIsEditingName(true)} className="text-[13px] font-bold text-[#FF2D55] px-2 py-1">Edit</button>
              )}
              {userName && (
                <button onClick={logout} className="text-[13px] font-bold text-[#6B7280] border border-[#E5E7EB] dark:border-slate-700 px-3 py-1 rounded-lg flex items-center gap-1.5">
                  <MdLogout size={14} /> Sign Out
                </button>
              )}
            </div>
          </div>
        </section>

        {/* SETTINGS LISTS */}
        <div className="space-y-6">
          {/* Appearance */}
          <div>
            <h3 className="text-[12px] font-bold text-[#6B7280] dark:text-gray-500 uppercase tracking-wider mb-2 px-1">Appearance</h3>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-[#E5E7EB] dark:border-slate-700 overflow-hidden divide-y divide-[#F8F9FC] dark:divide-slate-700/50">
              <div className="flex items-center justify-between px-4 h-[56px] cursor-pointer" onClick={toggleDarkMode}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[12px] bg-brand-light dark:bg-brand-pink/10 flex items-center justify-center text-brand-pink">
                    {isDarkMode ? <MdDarkMode size={20} /> : <MdLightMode size={20} />}
                  </div>
                  <span className="text-[15px] font-medium text-[#111827] dark:text-white">Dark Mode</span>
                </div>
                <button 
                  className={`w-11 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-brand-pink' : 'bg-[#E5E7EB] dark:bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-6' : 'left-1'}`}></div>
                </button>
              </div>

              {/* Install PWA Option if applicable */}
              {(isInstallable || isInstalled) && (
                <div 
                  className="flex items-center justify-between px-4 h-[56px] cursor-pointer"
                  onClick={isInstallable ? installPWA : undefined}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[12px] bg-brand-light dark:bg-brand-pink/10 flex items-center justify-center text-brand-pink">
                      <MdInstallMobile size={20} />
                    </div>
                    <span className="text-[15px] font-medium text-[#111827] dark:text-white">Install App</span>
                  </div>
                  {isInstallable && (
                    <button className="text-[13px] font-bold text-brand-pink px-3 py-1 bg-brand-light rounded-lg">Install</button>
                  )}
                  {isInstalled && (
                    <span className="text-[12px] font-bold text-[#6B7280]">Installed</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Data Management */}
          <div>
            <h3 className="text-[12px] font-bold text-[#6B7280] dark:text-gray-500 uppercase tracking-wider mb-2 px-1">Data Management</h3>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-[#E5E7EB] dark:border-slate-700 overflow-hidden">
              <div className="flex items-center justify-between px-4 h-[56px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[12px] bg-brand-light dark:bg-brand-pink/10 flex items-center justify-center text-brand-pink">
                    <MdDeleteSweep size={20} />
                  </div>
                  <span className="text-[15px] font-medium text-[#111827] dark:text-white">Clear Processed Files</span>
                </div>
                <button 
                  onClick={() => setShowClearDialog(true)}
                  className="text-[13px] font-bold text-brand-pink px-3 py-1 bg-brand-light rounded-lg"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* DONATION SECTION */}
          <section className="bg-white dark:bg-slate-800 rounded-[16px] p-5 border border-[#FFE4EA] dark:border-slate-700 shadow-sm relative overflow-hidden group">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-[12px] bg-brand-light dark:bg-brand-pink/10 flex items-center justify-center text-brand-pink shrink-0">
                <MdFavorite size={22} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-brand-gradient font-display mb-1">Support FileMint</h3>
                <p className="text-[13px] text-[#6B7280] dark:text-gray-400 leading-relaxed font-medium">
                  If FileMint helps you, consider supporting us with a small voluntary donation.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              {donationAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
                  className={`flex-1 py-2.5 rounded-xl text-[14px] font-bold transition-all border ${
                    selectedAmount === amount 
                    ? 'bg-brand-pink border-brand-pink text-white shadow-md' 
                    : 'bg-white dark:bg-slate-700 border-brand-light text-brand-pink hover:bg-brand-light/30'
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[#6B7280] dark:text-gray-500 text-[11px] font-medium border-t border-[#F8F9FC] dark:border-slate-700 pt-3">
              <span className="w-4 h-4 rounded-full bg-brand-light dark:bg-brand-pink/10 text-brand-pink flex items-center justify-center text-[10px]">✓</span>
              <span>Secure one-time contribution via UPI/Card</span>
            </div>
          </section>

          {/* ABOUT & LEGAL SECTION */}
          <div>
            <h3 className="text-[12px] font-bold text-[#6B7280] dark:text-gray-500 uppercase tracking-wider mb-2 px-1">About & Legal</h3>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-[#E5E7EB] dark:border-slate-700 overflow-hidden divide-y divide-[#F8F9FC] dark:divide-slate-700/50">
              
              {[
                { id: 'about', label: 'About FileMint', icon: <MdInfo size={20} /> },
                { id: 'privacy', label: 'Privacy Policy', icon: <MdShield size={20} /> },
                { id: 'terms', label: 'Terms & Conditions', icon: <MdGavel size={20} /> },
                { id: 'disclaimer', label: 'Disclaimer', icon: <MdHelpOutline size={20} /> },
                { id: 'refund', label: 'Refund Policy', icon: <MdCreditCard size={20} /> },
                { id: 'contact', label: 'Contact Us', icon: <MdEmail size={20} /> },
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveLegalPage(item.id)}
                  className="w-full flex items-center justify-between px-4 h-[60px] hover:bg-brand-light/20 dark:hover:bg-slate-700/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[12px] bg-brand-light dark:bg-brand-pink/10 flex items-center justify-center text-brand-pink group-active:scale-95 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-[15px] font-medium text-[#111827] dark:text-white">{item.label}</span>
                  </div>
                  <MdChevronRight className="text-[#E5E7EB] dark:text-slate-600 transition-transform group-hover:translate-x-1" size={20} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRMATION DIALOG */}
      <AnimatePresence>
        {showClearDialog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowClearDialog(false)}
              className="absolute inset-0 bg-[#111827]/40 dark:bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              className="relative w-full max-w-xs bg-white dark:bg-slate-800 rounded-[24px] p-6 shadow-xl border border-[#E5E7EB] dark:border-slate-700"
            >
              <div className="w-12 h-12 bg-[#FFE4EA] dark:bg-brand-pink/10 rounded-full flex items-center justify-center text-[#FF2D55] mx-auto mb-4">
                <MdDeleteSweep size={24} />
              </div>
              <h4 className="text-[17px] font-bold text-[#111827] dark:text-white text-center mb-2">Clear History?</h4>
              <p className="text-[13px] text-[#6B7280] dark:text-gray-400 text-center mb-6">This will remove all your processed file history. This action cannot be undone.</p>
              
              <div className="flex flex-col gap-2">
                <button 
                  onClick={handleClearHistory}
                  className="w-full h-11 bg-[#FF2D55] text-white rounded-xl font-bold text-[14px] active:scale-95 transition-all text-center"
                >
                  Clear Everything
                </button>
                <button 
                  onClick={() => setShowClearDialog(false)}
                  className="w-full h-11 bg-[#F8F9FC] dark:bg-slate-900 text-[#6B7280] dark:text-gray-400 rounded-xl font-bold text-[14px] active:scale-95 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LEGAL PAGES OVERLAY */}
      <AnimatePresence>
        {activeLegalPage && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[150] bg-[#F8F9FC] dark:bg-slate-900 flex flex-col"
          >
            {/* Header */}
            <header className="h-[64px] flex items-center px-4 border-b border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-800">
              <button 
                onClick={() => setActiveLegalPage(null)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#111827] dark:text-white active:scale-90 transition-transform"
              >
                <MdArrowBack size={24} />
              </button>
              <h2 className="ml-2 text-[18px] font-bold text-[#111827] dark:text-white">
                {activeLegalPage === 'about' && 'About FileMint'}
                {activeLegalPage === 'privacy' && 'Privacy Policy'}
                {activeLegalPage === 'terms' && 'Terms & Conditions'}
                {activeLegalPage === 'disclaimer' && 'Disclaimer'}
                {activeLegalPage === 'refund' && 'Refund Policy'}
                {activeLegalPage === 'contact' && 'Contact Us'}
              </h2>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="bg-white dark:bg-slate-800 rounded-[20px] p-6 border border-[#E5E7EB] dark:border-slate-700 shadow-sm prose prose-sm dark:prose-invert max-w-none">
                {activeLegalPage === 'about' && (
                  <div className="space-y-4">
                    <p className="text-[15px] leading-relaxed">FileMint is a fast and simple file utility app designed to help you manage PDFs, images, and signatures easily.</p>
                    <p className="text-[15px] leading-relaxed">All processing happens on your device. Your files are not uploaded to any server.</p>
                    <div className="pt-6 border-t border-[#F8F9FC] dark:border-slate-700/50">
                      <p className="font-bold text-[#111827] dark:text-white">Version: 1.1</p>
                      <p className="text-[#6B7280] dark:text-gray-400">Built with ❤️ by Adarsh</p>
                    </div>
                  </div>
                )}
                {activeLegalPage === 'privacy' && (
                  <div className="space-y-4">
                    <p className="text-[15px] leading-relaxed">FileMint does not upload or store your files on any server. All processing happens locally on your device.</p>
                    <p className="text-[15px] leading-relaxed">We may collect limited data such as device information and usage analytics to improve performance.</p>
                    <p className="text-[15px] leading-relaxed">Third-party services like Google AdSense may use cookies to show relevant ads.</p>
                    <p className="text-[15px] leading-relaxed">We do not sell or share your personal data.</p>
                    <div className="p-4 bg-[#F8F9FC] dark:bg-slate-900 rounded-xl mt-4">
                      <p className="font-bold text-[#111827] dark:text-white">Contact: adarshathapa31@gmail.com</p>
                    </div>
                  </div>
                )}
                {activeLegalPage === 'terms' && (
                  <div className="space-y-4 text-[15px] leading-relaxed">
                    <p>By using FileMint, you agree to use the app only for lawful purposes.</p>
                    <p>We are not responsible for any data loss, file corruption, or misuse of generated files.</p>
                    <p>The app is provided “as is” without warranties.</p>
                    <p>We may update features or terms at any time without notice.</p>
                  </div>
                )}
                {activeLegalPage === 'disclaimer' && (
                  <div className="space-y-4 text-[15px] leading-relaxed">
                    <p>FileMint tools are provided for general purposes only.</p>
                    <p>We do not guarantee accuracy, reliability, or suitability for specific use cases.</p>
                    <p>Users are responsible for verifying outputs before use.</p>
                    <p>We are not liable for any damages or losses.</p>
                  </div>
                )}
                {activeLegalPage === 'refund' && (
                  <div className="space-y-4 text-[15px] leading-relaxed">
                    <p>All donations made to FileMint are voluntary and non-refundable.</p>
                    <p>Donations are used to support development and maintenance.</p>
                    <p>If you face any issue, contact:</p>
                    <p className="font-bold text-[#FF2D55] underline">adarshathapa31@gmail.com</p>
                  </div>
                )}
                {activeLegalPage === 'contact' && (
                  <div className="space-y-5 text-center py-6">
                    <div className="w-16 h-16 bg-[#FFE4EA] dark:bg-brand-pink/10 rounded-full flex items-center justify-center text-[#FF2D55] mx-auto mb-2">
                      <MdEmail size={32} />
                    </div>
                    <h3 className="text-[18px] font-bold text-[#111827] dark:text-white">Contact Us</h3>
                    <p className="text-[15px] text-[#6B7280] dark:text-gray-400">Have questions or need help?</p>
                    <div className="py-3 px-6 bg-[#F8F9FC] dark:bg-slate-900 rounded-2xl inline-block border border-[#E5E7EB] dark:border-slate-700">
                      <p className="text-[16px] font-bold text-[#FF2D55]">adarshathapa31@gmail.com</p>
                    </div>
                    <p className="text-[13px] text-[#9CA3AF] mt-4">We usually respond within 24–48 hours.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
