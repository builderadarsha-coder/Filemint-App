import { ToolItem } from './types';

export const TOOLS: ToolItem[] = [
  {
    id: 'merge-pdf',
    name: 'Merge PDF Files',
    description: 'Securely combine multiple PDF files into a single document in seconds. Perfect for organizing reports, study materials, and office paperwork without losing page quality.',
    category: 'pdf',
    iconName: 'merge-pdf',
    color: '#FF5A5A',
    status: 'active'
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF Size',
    description: 'Reduce your PDF file size while maintaining high visual quality. Ideal for email attachments and website uploads where large files are often restricted.',
    category: 'pdf',
    iconName: 'compress-pdf',
    color: '#FF8A3D',
    status: 'active'
  },
  {
    id: 'split-pdf',
    name: 'Split PDF Pages',
    description: 'Extract specific pages or break a large PDF into multiple smaller documents. Great for separating sections of ebooks or sending specific excerpts to colleagues.',
    category: 'pdf',
    iconName: 'split-pdf',
    color: '#FF5A5A',
    status: 'active'
  },
  {
    id: 'rotate-pages',
    name: 'Rotate PDF Pages',
    description: 'Fix incorrectly scanned documents by rotating individual pages or the entire file. Simply click to align your pages in portrait or landscape orientation perfectly.',
    category: 'pdf',
    iconName: 'rotate-pdf',
    color: '#FF5A5A',
    status: 'active'
  },
  {
    id: 'bg-remover',
    name: 'Remove Image Background',
    description: 'Remove backgrounds from your images instantly using AI. Create professional product photos or transparent PNGs for your design projects with zero effort.',
    category: 'image',
    iconName: 'magic',
    color: '#FF8A3D',
    status: 'active'
  },
  {
    id: 'compress-img',
    name: 'Compress Image Size',
    description: 'Shrink JPEG, PNG, and WebP images without noticeable quality loss. Speed up your website performance and save storage space on your device instantly.',
    category: 'image',
    iconName: 'compress-image',
    color: '#FF8A3D',
    status: 'active'
  },
  {
    id: 'resize-img',
    name: 'Resize Image Online',
    description: 'Change image dimensions by pixels or percentage. Scale your photos for social media profiles, thumbnails, or specific print requirements with high precision.',
    category: 'image',
    iconName: 'resize-image',
    color: '#FF8A3D',
    status: 'active'
  },
  {
    id: 'crop-rotate',
    name: 'Crop & Rotate Images',
    description: 'Trim unwanted edges and flip image files to find the perfect composition. A straightforward tool for quick photo edits before sharing or publishing.',
    category: 'image',
    iconName: 'crop',
    color: '#FF8A3D',
    status: 'active'
  },
  {
    id: 'watermark-pdf',
    name: 'Add Watermark',
    description: 'Protect your PDF documents by adding a custom text watermark. Discourage unauthorized copying and maintain your brand identity on every page.',
    category: 'pdf',
    iconName: 'watermark-pdf',
    color: '#FF5A5A',
    status: 'active'
  },
  {
    id: 'pdf-doc',
    name: 'Convert PDF to Word',
    description: 'Convert static PDF files into editable Word documents. Seamlessly extract text and layouts to make changes to your existing documents without retyping.',
    category: 'conversion',
    iconName: 'pdf-doc',
    color: '#FFA4B6',
    status: 'active'
  },
  {
    id: 'doc-pdf',
    name: 'Word to PDF Converter',
    description: 'Transform Word documents and text files into standard PDF format. Ensure your files look the same on every device and are protected from unauthorized edits.',
    category: 'conversion',
    iconName: 'doc-pdf',
    color: '#FFA4B6',
    status: 'active'
  },
  {
    id: 'pdf-text',
    name: 'OCR Scanner',
    description: 'Turn scanned documents and images into editable text using OCR. Save hours of manual typing by extracting information from non-searchable files instantly.',
    category: 'conversion',
    iconName: 'text-ocr',
    color: '#FFA4B6',
    status: 'active'
  },
  {
    id: 'text-pdf',
    name: 'Text to PDF',
    description: 'Convert your plain text notes, snippets, or code into clean, secure PDF files. Add a professional touch to your text-based data for easy sharing and printing.',
    category: 'conversion',
    iconName: 'text-pdf',
    color: '#FF5A5A',
    status: 'active'
  },
  {
    id: 'scanner',
    name: 'Scan Document to PDF',
    description: 'Scan physical documents using your mobile camera and save them as high-quality PDFs. Your digital office in your pocket for receipts, notes, and contracts.',
    category: 'scan_files',
    iconName: 'scan',
    color: '#76D3A0',
    status: 'active'
  },
  {
    id: 'signature-gen',
    name: 'Signature Generator',
    description: 'Create your digital signature by drawing or typing. Download as PNG and resize it for exams and online forms instantly.',
    category: 'image',
    iconName: 'signature-gen',
    color: '#FF5A5A',
    status: 'active'
  },
  {
    id: 'my-files',
    name: 'File Manager',
    description: 'Browse your recent processed file tools history securely',
    category: 'scan_files',
    iconName: 'folder',
    color: '#50B2C0',
    status: 'active'
  }
];

export const POPULAR_TOOLS = ['merge-pdf', 'compress-pdf', 'bg-remover', 'compress-img'];
