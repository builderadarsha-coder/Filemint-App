import { useState, useEffect, useCallback } from 'react';
import { set, get, del, keys, clear } from 'idb-keyval';
import { FileItem } from '../types';

export const useFileManager = () => {
  const [files, setFiles] = useState<FileItem[]>([]);

  const loadFiles = useCallback(async () => {
    try {
      const allKeys = await keys();
      const metaKeys = allKeys.filter(k => typeof k === 'string' && k.startsWith('meta_'));
      
      const fileMetaList: FileItem[] = [];
      for (const k of metaKeys) {
        const meta = await get<FileItem>(k);
        if (meta) {
          fileMetaList.push(meta);
        }
      }
      
      fileMetaList.sort((a, b) => b.date - a.date);
      setFiles(fileMetaList);
    } catch (e) {
      console.error('Failed to load files:', e);
    }
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const saveFile = async (meta: Omit<FileItem, 'id' | 'date'>, blob: Blob) => {
    try {
      const id = Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
      const newMeta: FileItem = {
        ...meta,
        id,
        date: Date.now()
      };
      
      await set(`meta_${id}`, newMeta);
      await set(`file_${id}`, blob);
      
      setFiles(prev => [newMeta, ...prev]);
      return id;
    } catch (e) {
      console.error('Failed to save file:', e);
    }
  };

  const getFileData = async (id: string): Promise<Blob | undefined> => {
    try {
      return await get<Blob>(`file_${id}`);
    } catch (e) {
      console.error('Failed to get file data:', e);
    }
  };

  const deleteFile = async (id: string) => {
    try {
      await del(`meta_${id}`);
      await del(`file_${id}`);
      setFiles(prev => prev.filter(f => f.id !== id));
    } catch (e) {
      console.error('Failed to delete file:', e);
    }
  };

  const clearAllFiles = async () => {
    try {
      await clear();
      setFiles([]);
    } catch (e) {
      console.error('Failed to clear files:', e);
    }
  };

  return { files, saveFile, getFileData, deleteFile, clearAllFiles, loadFiles };
};
