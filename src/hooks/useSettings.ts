import { useState, useEffect, useCallback } from 'react';

const SETTINGS_CHANGE_EVENT = 'settingsChange';

function emitSettingsChange() {
  window.dispatchEvent(new Event(SETTINGS_CHANGE_EVENT));
}

export function useSettings() {
  const [userName, setUserName] = useState<string | null>(() => localStorage.getItem('userName'));
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('darkMode') === 'true' || 
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setUserName(localStorage.getItem('userName'));
      setIsDarkMode(localStorage.getItem('darkMode') === 'true' || 
        (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches));
    };

    window.addEventListener(SETTINGS_CHANGE_EVENT, handleStorageChange);
    return () => window.removeEventListener(SETTINGS_CHANGE_EVENT, handleStorageChange);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' || 
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const next = !isDark;
    localStorage.setItem('darkMode', String(next));
    emitSettingsChange();
  }, []);
  
  const saveUserName = useCallback((name: string) => {
    localStorage.setItem('userName', name);
    emitSettingsChange();
  }, []);
  
  const logout = useCallback(() => {
    localStorage.removeItem('userName');
    emitSettingsChange();
  }, []);

  return { userName, saveUserName, logout, isDarkMode, toggleDarkMode };
}
