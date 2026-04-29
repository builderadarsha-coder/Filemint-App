import React from 'react';
import { Icon } from './Icon';
import { ToolItem } from '../../types';

interface ToolCardProps {
  tool: ToolItem;
  onClick: () => void;
  size?: 'normal' | 'large';
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="bg-white dark:bg-slate-800 p-3.5 rounded-[16px] border border-[#E5E7EB] dark:border-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)] text-left flex flex-col justify-between transition-all duration-300 ease-out hover:border-brand-pink/20 hover:scale-[1.02] active:scale-[0.98] group w-full aspect-square"
    >
      <div className="flex justify-between items-start w-full">
        <Icon name={tool.iconName} showContainer className="group-hover:shadow-md transition-shadow" />
        {tool.status === 'soon' && (
          <span className="bg-gray-50 dark:bg-slate-900 text-[#9CA3AF] text-[8px] px-2 py-0.5 rounded-full font-bold tracking-wide uppercase border border-[#E5E7EB] dark:border-slate-800">Soon</span>
        )}
      </div>
      <div className="flex flex-col">
        <h3 className="font-bold text-[#111827] dark:text-gray-100 leading-tight font-display text-[14px] line-clamp-1 group-hover:text-brand-gradient">{tool.name}</h3>
        <p className="text-[#6B7280] dark:text-gray-500 leading-tight font-medium line-clamp-2 text-[11px] mt-1">{tool.description}</p>
      </div>
    </button>
  );
};
