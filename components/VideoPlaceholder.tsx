
import React from 'react';
import { VideoIcon } from './icons/VideoIcon';

const VideoPlaceholder: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <VideoIcon className="w-24 h-24 text-sky-500 mb-6" />
      <h2 className="text-3xl font-bold text-slate-100 mb-4">Video Generation Coming Soon!</h2>
      <p className="text-lg text-slate-400 max-w-md">
        We're working hard to bring AI-powered video generation to the Creative Studio. 
        Currently, this feature is not available via the Gemini API.
      </p>
      <p className="text-lg text-slate-400 mt-2 max-w-md">
        Stay tuned for updates!
      </p>
    </div>
  );
};

export default VideoPlaceholder;
