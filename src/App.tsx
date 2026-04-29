/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layout } from './components/ui/Layout';
import { HomeView } from './components/views/HomeView';
import { ToolsView } from './components/views/ToolsView';
import { FileManagerView } from './components/views/FileManagerView';
import { SettingsView } from './components/views/SettingsView';
import { ToolExecutionView } from './components/views/ToolExecutionView';
import { TabType, ToolItem } from './types';
import { useSettings } from './hooks/useSettings';

export default function App() {
  const { isDarkMode } = useSettings();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeTool, setActiveTool] = useState<ToolItem | null>(null);

  const handleToolClick = (tool: ToolItem) => {
    if (tool.id === 'my-files') {
      setActiveTab('files');
      setActiveTool(null);
    } else if (tool.id === 'all-tools') {
      setActiveTab('tools');
      setActiveTool(null);
    } else {
      setActiveTool(tool);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex justify-center w-full transition-colors duration-300">
      <Layout activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setActiveTool(null); }}>
        {activeTool ? (
          <ToolExecutionView tool={activeTool} onBack={() => setActiveTool(null)} onToolSelect={handleToolClick} />
        ) : (
          <>
            {activeTab === 'home' && <HomeView onToolClick={handleToolClick} />}
            {activeTab === 'tools' && <ToolsView onToolClick={handleToolClick} />}
            {activeTab === 'files' && <FileManagerView />}
            {activeTab === 'settings' && <SettingsView />}
          </>
        )}
      </Layout>
    </div>
  );
}
