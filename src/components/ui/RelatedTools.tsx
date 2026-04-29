import React from 'react';
import { TOOLS } from '../../constants';
import { ToolItem } from '../../types';
import { Icon } from './Icon';

const RELATED_MAP: Record<string, string[]> = {
  'merge-pdf': ['split-pdf', 'compress-pdf', 'rotate-pages'],
  'compress-pdf': ['merge-pdf', 'split-pdf', 'pdf-doc'],
  'split-pdf': ['merge-pdf', 'compress-pdf', 'rotate-pages'],
  'rotate-pages': ['merge-pdf', 'split-pdf', 'compress-pdf'],
  'text-pdf': ['pdf-text', 'merge-pdf'],
  'pdf-text': ['text-pdf', 'doc-pdf', 'scanner'],
  'doc-pdf': ['pdf-doc', 'merge-pdf'],
  'pdf-doc': ['doc-pdf', 'compress-pdf'],
  'scanner': ['merge-pdf', 'pdf-text', 'compress-pdf'],
  'bg-remover': ['compress-img', 'resize-img', 'crop-rotate'],
  'compress-img': ['resize-img', 'crop-rotate', 'bg-remover'],
  'resize-img': ['compress-img', 'crop-rotate', 'bg-remover'],
  'crop-rotate': ['resize-img', 'compress-img', 'bg-remover'],
  'signature-gen': ['resize-img', 'compress-img', 'scanner', 'merge-pdf'],
};

interface RelatedToolsProps {
  currentToolId: string;
  onToolSelect: (tool: ToolItem) => void;
}

export const RelatedTools: React.FC<RelatedToolsProps> = ({ currentToolId, onToolSelect }) => {
  const relatedIds = RELATED_MAP[currentToolId] || [];
  
  if (relatedIds.length === 0) return null;

  const relatedTools = relatedIds
    .map(id => TOOLS.find(t => t.id === id))
    .filter(Boolean) as ToolItem[];

  if (relatedTools.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 animate-in fade-in duration-300">
      <div className="mb-3 px-1">
        <h3 className="text-[13px] font-medium uppercase tracking-[0.1em] text-[#6B7280] dark:text-gray-500 mb-1">Explore More</h3>
        <p className="text-[15px] text-[#111827] dark:text-gray-100 font-semibold">Recommended tools for you</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {relatedTools.map(tool => (
          <button
            key={tool.id}
            onClick={() => onToolSelect(tool)}
            className="flex flex-col p-3 bg-white dark:bg-slate-900/40 rounded-[14px] border border-[#F1F5F9] dark:border-slate-800 shadow-[0_1px_2px_rgba(0,0,0,0.02)] active:scale-[0.96] hover:bg-[#FFF7F9] dark:hover:bg-brand-pink/5 hover:border-[#FFCCD6] dark:hover:border-brand-pink/20 transition-all text-left group"
          >
            <div className="w-[40px] h-[40px] rounded-[10px] bg-[#FFF1F4] dark:bg-brand-pink/10 flex items-center justify-center text-brand-pink flex-shrink-0 mb-3 group-hover:scale-105 transition-transform">
              <Icon name={tool.iconName} size={20} />
            </div>
            <span className="text-[14px] font-medium text-[#111827] dark:text-gray-200 leading-tight line-clamp-2">
              {tool.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
