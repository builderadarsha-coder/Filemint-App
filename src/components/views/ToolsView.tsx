import React, { useState } from 'react';
import { TOOLS } from '../../constants';
import { ToolCard } from '../ui/ToolCard';
import { ToolItem } from '../../types';

type CategoryFilter = 'all' | 'pdf' | 'image' | 'conversion' | 'scan_files';

export const ToolsView: React.FC<{ onToolClick: (tool: ToolItem) => void }> = ({ onToolClick }) => {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');

  const filteredTools = TOOLS.filter(
    tool => activeFilter === 'all' || tool.category === activeFilter
  );

  return (
    <div className="flex flex-col p-4 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-400 bg-bg-base dark:bg-slate-950">
      
      <div className="px-1 mt-1">
        <h1 className="text-[24px] font-bold text-brand-gradient font-display tracking-tight leading-none">All Toolbox</h1>
        <p className="text-[#6B7280] dark:text-gray-500 font-medium text-[13px] mt-1.5">Pick a tool to simplify your task.</p>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
        {(['all', 'pdf', 'image', 'conversion', 'scan_files'] as CategoryFilter[]).map((filter) => (
          <FilterChip 
            key={filter}
            label={filter.replace('_', ' & ').toUpperCase()} 
            isActive={activeFilter === filter} 
            onClick={() => setActiveFilter(filter)} 
          />
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-2 gap-4 px-1">
        {filteredTools.map(tool => (
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

const FilterChip: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap px-4 py-2 rounded-full text-[11px] font-bold transition-all duration-200 active:scale-95 border ${
        isActive 
          ? 'bg-brand-pink border-brand-pink text-white shadow-md' 
          : 'bg-white dark:bg-slate-800 border-[#E5E7EB] dark:border-slate-700 text-[#6B7280]'
      }`}
    >
      {label}
    </button>
  );
};

