import React, { useState } from 'react';
import { Search, User, Filter, ArrowRight } from 'lucide-react';
import { TOOLS } from '../../constants';
import { ToolCard } from '../ui/ToolCard';
import { Icon } from '../ui/Icon';
import { ToolItem } from '../../types';
import { Footer } from '../ui/Footer';

const PASTEL_COLORS = [
  '#FFF4D6', // Yellow
  '#EAF4FF', // Blue
  '#E8F8F2', // Green
  '#F3ECFF', // Purple
  '#FFEAE3'  // Peach
];

const CategoryCard: React.FC<{ icon: string, label: string, count: number }> = ({ icon, label, count }) => (
  <button className="flex flex-col items-start p-3 bg-white dark:bg-slate-800 rounded-[16px] min-w-[100px] border border-gray-100/50 dark:border-slate-700 shadow-[0_1px_4px_rgba(0,0,0,0.01)] hover:shadow-md transition-all active:scale-95 group">
    <div className="w-8 h-8 rounded-lg bg-brand-light dark:bg-brand-pink/10 flex items-center justify-center mb-2 transition-colors">
      <Icon name={icon} size={16} className="text-brand-pink" />
    </div>
    <span className="text-[12px] font-bold text-gray-900 dark:text-white leading-tight">{label}</span>
    <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 mt-0.5">{count} tools</span>
  </button>
);

const ToolSection: React.FC<{ title: string, tools: ToolItem[], onToolClick: (tool: ToolItem) => void, onSeeAll?: () => void }> = ({ title, tools, onToolClick, onSeeAll }) => {
  if (tools.length === 0) return null;
  return (
    <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-[16px] font-bold text-brand-gradient font-display tracking-tight">{title}</h2>
        {onSeeAll && (
          <button onClick={onSeeAll} className="flex items-center gap-1 text-[13px] font-bold text-brand-pink hover:bg-brand-light px-3 py-1 rounded-full transition-all">
            See all
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 px-1">
        {tools.map(tool => (
          <ToolCard 
            key={tool.id} 
            tool={tool} 
            onClick={() => onToolClick(tool)} 
          />
        ))}
      </div>
    </div>
  );
};

export const HomeView: React.FC<{ onToolClick: (tool: ToolItem) => void }> = ({ onToolClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = TOOLS.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSearching = searchQuery.length > 0;

  // Quick Action tools
  const quickToolMap = [
    { id: 'merge-pdf', label: 'Merge' },
    { id: 'split-pdf', label: 'Split' },
    { id: 'compress-pdf', label: 'Compress' },
    { id: 'signature-gen', label: 'Sign' },
    { id: 'scanner', label: 'Scan' },
    { id: 'bg-remover', label: 'BG Remover' },
    { id: 'crop-rotate', label: 'Editor' },
    { id: 'all-tools', label: 'More' },
  ];

  const quickTools = quickToolMap.map((q) => {
    const tool = q.id === 'all-tools' 
      ? { id: 'all-tools', name: 'All tools', iconName: 'grid' } as any 
      : TOOLS.find(t => t.id === q.id);
    return { ...tool, displayLabel: q.label };
  }).filter(t => t.id);

  // Grouped tools
  const pdfTools = isSearching ? [] : TOOLS.filter(t => t.category === 'pdf').slice(0, 4);
  const imageTools = isSearching ? [] : TOOLS.filter(t => t.category === 'image').slice(0, 4);
  const conversionTools = isSearching ? [] : TOOLS.filter(t => t.category === 'conversion').slice(0, 4);
  const scanTools = isSearching ? [] : TOOLS.filter(t => t.category === 'scan_files').slice(0, 4);

  return (
    <div className="flex flex-col p-4 gap-6 bg-bg-base dark:bg-slate-950">
      
      {/* Header */}
      {!isSearching && (
        <div className="flex items-center justify-between px-1">
          <div className="flex flex-col">
            <h1 className="text-[24px] font-bold text-brand-gradient font-display tracking-tight leading-none">
              FileMint
            </h1>
            <p className="text-[#6B7280] dark:text-gray-500 font-medium text-[13px] mt-1">Efficient local file processing</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm border border-[#E5E7EB] dark:border-slate-700 text-brand-pink active:scale-90 transition-transform">
              <Search size={18} />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm border border-[#E5E7EB] dark:border-slate-700 overflow-hidden active:scale-90 transition-transform">
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Guest&backgroundColor=transparent" alt="User" />
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative px-1 -mt-2">
        <div className="absolute inset-y-0 left-[22px] flex items-center pointer-events-none">
          <Search size={16} className="text-brand-pink" />
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for tools, features..." 
          className="w-full bg-white dark:bg-slate-800 border-[#E5E7EB] dark:border-slate-700 border placeholder-[#9CA3AF] text-[#111827] dark:text-white rounded-[16px] py-[12px] pl-[48px] pr-[16px] shadow-sm focus:ring-2 focus:ring-brand-pink/10 focus:border-brand-pink transition-all font-medium text-[14px] h-[48px]"
        />
      </div>

      {!isSearching && (
        <>
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-4 gap-y-5 gap-x-4 px-1">
            {quickTools.map((tool) => (
              <button 
                key={tool.id}
                onClick={() => onToolClick(tool as ToolItem)}
                className="flex flex-col items-center group active:scale-90 transition-transform"
              >
                <Icon name={tool.iconName} showContainer className="mb-2 group-hover:scale-105" />
                <span className="text-[11px] font-bold text-[#6B7280] dark:text-gray-400 text-center leading-tight whitespace-nowrap overflow-hidden text-ellipsis w-full">
                  {tool.displayLabel}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Sections */}
      <div className="flex flex-col">
        {isSearching ? (
          <ToolSection title="Search Results" tools={filteredTools} onToolClick={onToolClick} />
        ) : (
          <>
            <ToolSection title="PDF Utilities" tools={pdfTools} onToolClick={onToolClick} onSeeAll={() => onToolClick({id: 'all-tools'} as ToolItem)} />
            <ToolSection title="Image Management" tools={imageTools} onToolClick={onToolClick} onSeeAll={() => onToolClick({id: 'all-tools'} as ToolItem)} />
            <ToolSection title="Fast Conversion" tools={conversionTools} onToolClick={onToolClick} onSeeAll={() => onToolClick({id: 'all-tools'} as ToolItem)} />
            <ToolSection title="Smart Scanning" tools={scanTools} onToolClick={onToolClick} onSeeAll={() => onToolClick({id: 'all-tools'} as ToolItem)} />
          </>
        )}
      </div>

      <Footer />
      
    </div>
  );
};

