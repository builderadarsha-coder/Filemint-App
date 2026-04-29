import React from 'react';
import { 
  Combine,
  Minimize2,
  Scissors,
  RotateCw,
  Wand2,
  Image,
  Maximize2,
  Crop,
  FileText,
  FileDigit,
  Languages,
  Scan,
  Folder,
  PenTool,
  Grid,
  FileEdit,
  ArrowRightLeft,
  FileUp,
  FileDown,
  FileOutput,
  FileInput,
  FileCheck,
  FileSignature,
  Stamp
} from 'lucide-react';

interface IconProps {
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
  fill?: string;
  showContainer?: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  'merge-pdf': Combine,
  'compress-pdf': Minimize2,
  'split-pdf': Scissors,
  'rotate-pdf': RotateCw,
  'magic': Wand2,
  'compress-image': Image,
  'resize-image': Maximize2,
  'crop': Crop,
  'pdf-doc': FileEdit,
  'doc-pdf': FileCheck,
  'text-ocr': Languages,
  'text-pdf': FileText,
  'scan': Scan,
  'folder': Folder,
  'edit-pdf': PenTool,
  'grid': Grid,
  'watermark-pdf': Stamp,
  'signature-gen': FileSignature,
};

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 20, 
  color = '#FF2D55', 
  className = '',
  showContainer = false 
}) => {
  const MappedIcon = ICON_MAP[name] || Folder;
  
  if (showContainer) {
    return (
      <div className={`w-10 h-10 rounded-[14px] bg-brand-light flex items-center justify-center text-brand-pink shadow-[0_1px_2px_rgba(255,45,85,0.05)] ${className}`}>
        <MappedIcon size={size} color={color} strokeWidth={2} />
      </div>
    );
  }

  return <MappedIcon size={size} color={color} className={className} strokeWidth={2} />;
};

