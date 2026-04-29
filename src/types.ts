export type TabType = 'home' | 'tools' | 'files' | 'settings';

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: 'pdf' | 'image' | 'conversion' | 'scan_files';
  status?: 'active' | 'soon';
  color?: string;
}

export interface FileItem {
  id: string;
  name: string;
  toolName: string;
  size: number;
  date: number;
  type: string;
}


