
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageGenerator from './components/ImageGenerator';
import VideoPlaceholder from './components/VideoPlaceholder';
import TabButton from './components/TabButton';
import { AppTab } from './types';
import { ImageIcon } from './components/icons/ImageIcon';
import { VideoIcon } from './components/icons/VideoIcon';


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.Image);

  const handleTabChange = useCallback((tab: AppTab) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col">
        <div className="mb-8 flex justify-center space-x-2 sm:space-x-4 border-b border-slate-700 pb-4">
          <TabButton
            label="Generate Image"
            isActive={activeTab === AppTab.Image}
            onClick={() => handleTabChange(AppTab.Image)}
            icon={<ImageIcon className="w-5 h-5 mr-2" />}
          />
          <TabButton
            label="Generate Video"
            isActive={activeTab === AppTab.Video}
            onClick={() => handleTabChange(AppTab.Video)}
            icon={<VideoIcon className="w-5 h-5 mr-2" />}
          />
        </div>

        <div className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-10 flex-grow">
          {activeTab === AppTab.Image && <ImageGenerator />}
          {activeTab === AppTab.Video && <VideoPlaceholder />}
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-slate-500">
        AI Creative Studio &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
